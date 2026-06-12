# Agent Notes

Use these notes when an AI agent edits this repo.

## Goal

This repo builds an Apple Shortcut for UAE parking SMS.

The Shortcut must:

1. Ask for parking code.
2. Ask for hours.
3. Send `plate code hours` by SMS.
4. Let the user set the plate and SMS contact on import.

## Privacy

Never commit a real plate number.

Never commit a private phone number.

Keep sample data fake.

Safe sample plate:

```text
ABC123
```

Safe sample parking code:

```text
301
```

Public Dubai SMS default:

```text
7275
```

## Important bug rule

Do not store the parking SMS number as plain text and then run `Get Phone Numbers from Input`.

That can fail for short codes like `7275`.

Use a Contact action with a vCard phone number.

## Build

Run:

```bash
npm install
npm run build
npm run check
```

## Test

Use a fake parking code such as `301` or `302`.

Warn the user before any real SMS send.

## README style

Use short words.

Use short lines.

Write for a normal person.

Do not use sales words.

Do not use private details.
