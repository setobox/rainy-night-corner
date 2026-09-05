import { describe, expect, it } from 'vitest'
import { doorOpening, rainFloor, safeDelta, trafficPhase } from './simulation'

describe('automatic door cycle', () => {
  it('waits, opens smoothly, holds, closes and repeats without jumping', () => {
    expect(doorOpening(0)).toBe(0)
    expect(doorOpening(15)).toBe(0)
    expect(doorOpening(16)).toBeCloseTo(0.5)
    expect(doorOpening(17)).toBe(1)
    expect(doorOpening(19.9)).toBe(1)
    expect(doorOpening(21)).toBeCloseTo(0.5)
    expect(doorOpening(22)).toBe(0)
    expect(doorOpening(40)).toBeCloseTo(doorOpening(16))
  })
  it('always stays within the physical door travel', () => {
    for (let time = -48; time <= 96; time += 0.125) {
      expect(doorOpening(time)).toBeGreaterThanOrEqual(0)
      expect(doorOpening(time)).toBeLessThanOrEqual(1)
    }
  })
})

describe('weather and tab suspension', () => {
  it('stops rain on the roof and canopy before it can enter the shop', () => {
    expect(rainFloor(0, -2)).toBe(5.05)
    expect(rainFloor(-4.5, -5.4)).toBe(5.05)
    expect(rainFloor(4, -2)).toBe(5.05)
    expect(rainFloor(4.2, -2)).toBe(0.12)
    expect(rainFloor(0, 1.2)).toBe(3.82)
    expect(rainFloor(5, -2)).toBe(0.12)
    expect(rainFloor(0, 4)).toBe(0.12)
  })
  it('preserves ordinary frame time and bounds resuming a hidden tab', () => {
    expect(safeDelta(1 / 60)).toBe(1 / 60)
    expect(safeDelta(600)).toBe(0.05)
    expect(safeDelta(-1)).toBe(0)
    expect(safeDelta(Number.NaN)).toBe(0)
    expect(safeDelta(Infinity)).toBe(0)
  })
})

it('changes the distant signal through a complete repeating cycle', () => {
  expect(trafficPhase(0)).toBe('red')
  expect(trafficPhase(14)).toBe('green')
  expect(trafficPhase(27)).toBe('amber')
  expect(trafficPhase(30)).toBe('red')
})
