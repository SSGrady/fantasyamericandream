---
id: T115
title: Contextual event-linked quizzes
status: open
type: feature
priority: P3
epic: E017
sprint: S020
depends_on:
  - T101
acceptance:
  - RTO interrupt triggers commute cost quiz, not generic $100K milestone quiz
  - Quiz registry maps eventId to literacy module
  - Wrong quiz never offered for given interrupt
  - Unlock still gates analysis tools per skill tree rules
---

# T115 - Contextual Event-Linked Quizzes

## Description

Tie literacy quizzes to triggering events (RTO → commute, layoff → runway, etc.).

## Feedback

Generic $100K quiz during RTO broke immersion and relevance.

## Grill me

- Skip quiz if skill already mastered?
- Inline quiz in interrupt overlay vs separate modal?
- Author quizzes in chapter JSON or central registry?
