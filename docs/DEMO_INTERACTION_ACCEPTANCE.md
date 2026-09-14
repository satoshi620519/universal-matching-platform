# NEXA Demo — Interactive Acceptance Checklist

This document defines the buyer-facing interaction contract for the live NEXA demo. It is intentionally separate from RC1 evidence; it describes the current demo target and must not be treated as a release PASS record.

## Core navigation

- [ ] 探す: candidate profile is visible and actions are clickable.
- [ ] マッチ: only mutual matches are shown.
- [ ] メッセージ: messaging is blocked until a mutual match exists.
- [ ] 通知: unread count is visible and read-all control is clickable.
- [ ] プロフィール: profile controls open interactive panels.
- [ ] 安心・安全: block, report, privacy and safety mode controls are clickable.
- [ ] 地域・言語: language and region selectors change displayed state.
- [ ] 設定: safety, notification, display/accessibility and account controls change state.

## Matching flow

1. Open `探す`.
2. Click `♡ いいね`.
3. Confirm the like state changes.
4. When the incoming like is present, click `相互マッチを成立`.
5. Confirm the profile becomes MATCHED and the match count changes.
6. Open `マッチ` and confirm the matched profile is listed.
7. Open `メッセージ` and confirm the matched conversation is available.
8. Send a message and confirm it appears in the conversation.
9. Before mutual matching, confirm the message composer is not available.

## Profile and safety flow

- Profile edit control opens a modal/panel rather than a browser alert.
- Visibility control changes between public and limited visibility.
- Identity verification changes to verified state.
- Gallery control increments the displayed gallery count.
- Block records the selected profile as blocked and moves the discovery view away from it.
- Report records the selected profile as reported.
- Safety mode toggles ON/OFF.
- Privacy control changes the location-protection state.

## Global and settings flow

- Language can be changed among Japanese, English, Korean and Chinese.
- Region can be changed among Japan, US, EU and Southeast Asia.
- Notification mode can be changed.
- Display/accessibility mode can be changed.
- Account state can be changed.

## Buyer-facing quality bar

The demo should communicate a real product experience rather than a collection of static screenshots or placeholder alerts. Every primary navigation item must lead to a visible state, and every visible primary action must either change state, open an interaction panel, or move to the next valid step.

## Important evidence rule

A checked item in this document is a test instruction, not evidence of execution. Actual PASS/FAIL results require a runnable environment and must be recorded with the tested commit and date. Do not fabricate execution results.
