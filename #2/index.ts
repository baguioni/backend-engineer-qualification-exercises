import json from "./data.json"

type TimestampStatus = {
  status: "PARTIALLY_AVAILABLE" | "UNAVAILABLE" | "AVAILABLE",
  timestamp: string | Date
}

// Not a scalable solution. 
// Better to use a stream but since it's relatively small, 
// putting it into memory should be fine
const logs = json as TimestampStatus[] 

/**
 * Calculates the ratio between the amount of time when status is AVAILABLE and
 * the amount of time between startDateTime inclusive and endDateTime exclusive.
 * @param startDateTime 
 * @param endDateTime 
 */
export function availability(startDateTime: Date, endDateTime: Date): number {
  const totalTime = endDateTime.getTime() - startDateTime.getTime()

  let totalTimeUnavailable = 0
  let unavailableStartTime;
  let previousAvailable = true 

  // O(n) and for loops more performant compared to filter
  for(const log of logs) {
    const currentTime = new Date(log.timestamp)

    if (currentTime.getTime() >= endDateTime.getTime()) {
      break
    }

    if (currentTime.getTime() >= startDateTime.getTime()) {
      const currentlyAvailabe = log.status === "AVAILABLE"

      if (previousAvailable && !currentlyAvailabe) {
        unavailableStartTime = currentTime
        previousAvailable = false
      }

      if (!previousAvailable && currentlyAvailabe && unavailableStartTime) {
        const endTimeUnavailable = currentTime
        totalTimeUnavailable += getTimeDifference(endTimeUnavailable, unavailableStartTime)
        previousAvailable = true
      }
    }
  }
    return Math.abs((totalTime-totalTimeUnavailable)/totalTime)
}

type Outages = { type: 'PARTIAL' | 'MAJOR', timestamp: Date, duration: number }

enum OutageStatus {
  PARTIALLY_AVAILABLE= "PARTIAL",
  UNAVAILABLE= "MAJOR"
}

/**
 * Generates the outages between startDateTime inclusive and endDateTime exclusive.
 * An outage is PARTIAL if the status within the period is PARTIALLY_AVAILABLE.
 * Similarly, an outage is MAJOR if the status within the period is UNAVAILABLE.
 * @param startDateTime 
 * @param endDateTime 
 */
export function outages(startDateTime: Date, endDateTime: Date): Outages[] {
  let outage: Outages[] = [];
  let previousState: TimestampStatus["status"] = "AVAILABLE"
  let startTimeOutage;

  for(const log of logs) {
    const currentTime = new Date(log.timestamp)

    if (currentTime.getTime() >= endDateTime.getTime()) {
      break
    }

    const currentState = log.status
    
    // State change occurs
    if (currentTime.getTime() >= startDateTime.getTime() && currentState !== previousState) {
      
      if (previousState !== "AVAILABLE" && startTimeOutage) {
        outage.push({
          type: OutageStatus[previousState],
          timestamp: startTimeOutage,
          duration: millisecondsToMinutes(getTimeDifference(currentTime, startTimeOutage))
        })
      }

      startTimeOutage = currentTime
      previousState = currentState
    }
  }

  return outage;
}

// Helper functions
const millisecondsToMinutes = (duration: number): number => {
  return Math.round(duration/60000)
}

const getTimeDifference = (d1: Date, d2: Date): number => {
  return Math.abs(d1.getTime()- d2.getTime())
}