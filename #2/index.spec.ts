import { expect } from 'chai';
import { availability, outages } from '.';

describe('availability', () => {
  const cases: { input: Parameters<typeof availability>, output: ReturnType<typeof availability> }[] = [
    {
      input: [new Date('2020-03-01T00:00:00.000Z'), new Date('2020-03-02T00:00:00.000Z')],
      output: 1,
    },
    {
      input: [new Date('2020-03-05T00:00:00.000Z'), new Date('2020-03-06T00:00:00.000Z')],
      output: 1,
    },
    {
      input: [new Date('2020-03-01T00:00:00.000Z'), new Date('2020-04-01T00:00:00.000Z')],
      output: 1,
    }
  ];

  for (const { input, output } of cases) {
    it('should generate correct output', () => {
      expect(availability.apply(null, input)).to.equal(output);
    });
  }
});

describe('outages', () => {
  const cases: { input: Parameters<typeof outages>, output: ReturnType<typeof outages> }[] = [
    {
      input: [new Date('2020-03-01T00:00:00.000Z'), new Date('2020-03-02T00:00:00.000Z')],
      output: [],
    },
    {
      input: [new Date('2020-03-05T00:00:00.000Z'), new Date('2020-03-06T00:00:00.000Z')],
      output: [
        {
          type: 'MAJOR',
          timestamp: new Date('2020-03-05T06:24:00.000Z'),
          duration: 31,
        },
        {
          type: 'PARTIAL',
          timestamp: new Date('2020-03-05T06:55:00.000Z'),
          duration: 15,
        }
      ],
    },
    {
      input: [new Date('2020-03-01T00:00:00.000Z'), new Date('2020-04-01T00:00:00.000Z')],
      output: [
        {
          type: 'MAJOR',
          timestamp: new Date('2020-03-05T06:24:00.000Z'),
          duration: 31,
        },
        {
          type: 'PARTIAL',
          timestamp: new Date('2020-03-05T06:55:00.000Z'),
          duration: 15,
        },
        {
          type: 'MAJOR',
          timestamp: new Date('2020-03-20T03:45:00.000Z'),
          duration: 90,
        },
        {
          type: 'PARTIAL',
          timestamp: new Date('2020-03-05T05:15:00.000Z'),
          duration: 30,
        },
        {
          type: 'PARTIAL',
          timestamp: new Date('2020-03-25T16:15:00.000Z'),
          duration: 10,
        }
      ],
    }
  ];

  for (const { input, output } of cases) {
    it('should generate correct output', () => {
      expect(availability.apply(null, input)).to.deep.equal(output);
    });
  }
});
