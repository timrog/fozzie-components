# Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

v0.25.0
------------------------------
*September 9, 2021*

### Added
- Tests to cover version changes in v0.24.0.

### Changed
- `dk-DK` to `da-DK`. 


v0.24.0
------------------------------
*August 27, 2021*

### Fixed
- Moved `isBodyHeightLessThanWindowHeight` to computed so it can re-calculate cookie position.


v0.23.0
------------------------------
*August 19, 2021*

### Added
- `dk-DK` to the list of locales in the banner's static version.


v0.22.0
------------------------------
*August 18, 2021*

### Changed
- Expiry date set to 90 days
- Check for "window" object when checking height to avoid SSR error


v0.21.0
------------------------------
*July 30, 2021*

### Changed
- Reopen link should appear at the bottom of the window, even when the main content is less than 100% height


Latest (to be added to next version)
------------------------------
*July 15, 2021*

### Changed
- Updated version of `f-button`.


v0.20.0
------------------------------
*July 12, 2021*

### Changed
- Reopen link should not show for tenants where legacy banner is used
- shouldUseGreyBackground prop wired up correctly


v0.19.0
------------------------------
*June 24, 2021*

### Added
- Config to generate compiled vanilla js versions of the vue component


v0.18.0
------------------------------
*June 17, 2021*

### Changed
- UK to two-button banner


v0.17.0
------------------------------
*June 17, 2021*

### Changed
- Percy to run desktop / mobile in separate specs


v0.16.1
------------------------------
*June 15, 2021*

### Changed
- Set default of useGreyBackground to true (most JE apps need this set to true)


v0.16.0
------------------------------
*June 14, 2021*

### Added
- Attach link to bottom of page to reopen the cookie consent banner


v0.15.0
------------------------------
*June 10, 2021*

### Changed
- Hide banner action wrapped in Promise to call the resendEvents asynchronously
- Tests updated accordingly


v0.14.0
------------------------------
*June 9, 2021*

### Added
- Percy Visual Regression tests for Legacy and ConsentBanner


v0.13.0
------------------------------
*May 27, 2021*

### Added
- Method to hide legacy cookie banner(s) to avoid race conditions


v0.12.0
------------------------------
*May 25, 2021*

### Changed
- CSS variables to use pie design tokens instead of fozzie-colour-palette vars


v0.11.0
------------------------------
*May 24, 2021*

### Changed
- Component object export
- New `policyLinkHref` function in component objects


v0.10.0
------------------------------
*May 18, 2021*

### Changed
- rename showLegacyBanner prop to shouldShowLegacyBanner for Sacha
- shouldShowLegacyBanner can be passed in as a prop to allow experimentation in UK rollout


v0.9.0
------------------------------
*May 10, 2021*

### Removed
- `is-visuallyHidden` css style definition as should come from `fozzie`


v0.8.0
------------------------------
*May 6, 2021*

### Added
- `f-mega-modal` component to cookie banner.

### Removed
- Styles related to old modal & modal container.

### Fixed
- Added documentation to indicate cookie-banner will delete cookies conditionally that are not in the exclusion list.


v0.7.1
------------------------------
*April 22, 2021*

### Changed
- Added is-visuallyHidden CSS to Legacy Banner
- Add locale prop to usage documentation in README


v0.7.0
------------------------------
*April 8, 2021*

### Changed
- Wrapped cookie banner content to a div which now is a description for the assistive tech via `aria-describedby`
- Moved dialog role and aria labels to the higher div to contain both banner context and buttons
- `f-button` component version bump


v0.6.1
------------------------------
*April 6, 2021*

### Fixed
- DataLayer push on showing banner
- Call resendEvents on "Accept all" button click
- Update tests


v0.6.0
------------------------------
*March 18, 2021*

### Added
- New tests to test f-cookiebanner in `component`
- New test supporting files in `test-utils/compoenent-objects`
- Browserstack support and file structures in tests
- A11y tests

### Fixed
- URL for NZ cookie policy


v0.5.0
------------------------------
*March 9, 2021*

### Changed
- Legacy banner button to use native button.
- Switch to legacy banner for AU/NZ


v0.4.0
------------------------------
*March 2, 2021*

### Changed
- Default locale prop value `en-GB` to be `''`.


v0.3.2
------------------------------
*March 2, 2021*

### Fixed
- Protocol missing from image request (Required for Lighthouse checks).

v0.3.1
------------------------------
*March 2, 2021*

### Fixed
- `shouldHideBanner` data property defaults to `true` in order to avoid flash of cookie banner after it has been dismissed.

v0.3.0
------------------------------
*February 25, 2021*

### Changed
- Update tests to use js-cookie.
- Update legacy cookie value
- Remove f-globalisation mixin

v0.2.0
------------------------------
*February 17, 2021*

### Changed
- Use js-cookie instead of universal-cookie.

### Removed
- Remove Storybook 'knob' for setting legacy banner.

v0.1.2
------------------------------
*February 12, 2021*

### Changed
- Set `isIosBrowser` property on page mount so that we can avoid using `process` check which caused issues with SSR.
- Minor lint updates.
- Moved legacy banner check into computed property in order to avoid the flash of the modern cookie banner on page load.

v0.1.1
------------------------------
*February 11, 2021*

### Changed
- Amend class name on legacy banner
- Move legacy banner out of overlay
- Include hide class for legacy banner
- Wrap `navigator` call in conditional for `process.browser`

v0.1.0
------------------------------
*February 3, 2021*

### Added
- Initial commit
