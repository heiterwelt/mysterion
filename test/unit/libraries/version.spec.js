/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow

import { describe, expect, it } from '../../helpers/dependencies'
import { getMysterionReleaseId, getVersionLabel } from '../../../src/libraries/version'

describe('versioning', () => {
  describe('.getVersionLabel', () => {
    it('returns label', () => {
      expect(getVersionLabel('0.0.1(123)', '1.0.0')).to.eql('v0.0.1(123)-1.0.0')
    })

    it('returns label without client version', () => {
      expect(getVersionLabel('0.0.1(123)', null)).to.eql('v0.0.1(123)')
    })
  })

  describe('getMysterionReleaseId', () => {
    it('returns joined release label', () => {
      expect(getMysterionReleaseId('0.0.1', '123')).to.eql('0.0.1(123)')
    })

    it('returns joined release label with compact build number', () => {
      expect(getMysterionReleaseId('0.0.1', '123.1')).to.eql('0.0.1(123)')
      expect(getMysterionReleaseId('0.0.1', '1.5')).to.eql('0.0.1(1)')
    })

    it('returns release label without build', () => {
      expect(getMysterionReleaseId('0.0.1', null)).to.eql('0.0.1')
    })

    it('returns release label without version', () => {
      expect(getMysterionReleaseId(null, '123')).to.eql('(123)')
    })

    it('returns empty label without version and build', () => {
      expect(getMysterionReleaseId(null, null)).to.eql('')
    })
  })
})
