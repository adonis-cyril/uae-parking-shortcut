# UAE Parking SMS Shortcut

Pay for parking by SMS with one Apple Shortcut.

The shortcut asks for:

1. Your parking code
2. How many hours you want

Then it sends a text like this:

```text
PLATE PARKING_CODE HOURS
```

Example:

```text
ABC123 318C 1
```

This is useful in Dubai and other UAE places where parking is paid by SMS.

## What this is

This repo makes an Apple Shortcut file.

The Shortcut can:

1. Store your car plate number
2. Store the SMS contact for parking
3. Ask you for the parking code each time
4. Ask you for the time each time
5. Send the SMS for you

The default SMS number is `7275`, which is used for Dubai parking.

Other UAE places may use another number. You can change it when you set up the Shortcut.

## What this is not

This is not an official parking app.

This is not made by any city, parking office, phone company, or Apple.

You must check your own parking rules, fees, zone code, plate format, and SMS number.

## Safety note

SMS parking can cost money.

Test with care.

The first time you run the Shortcut, iPhone may ask if the Shortcut can send a message. Read the screen before you allow it.

## Private data

This repo does not include a real car plate.

This repo does not include a private phone number.

The sample plate is:

```text
ABC123
```

Change it to your own plate when you add the Shortcut.

## How to use the ready file

1. Open the `dist` folder.
2. Open `UAE Parking SMS.shortcut`.
3. Add it to Apple Shortcuts.
4. When it asks for your car plate, type your plate.
5. When it asks for the parking SMS contact, choose or make a contact.

For Dubai, the contact can be:

```text
Name: Dubai Parking
Phone: 7275
```

For another UAE place, use the SMS number that place gives you.

## Best setup

Make a contact first.

Example:

```text
Name: Dubai Parking
Phone: 7275
```

Then import the Shortcut.

When it asks for the parking SMS contact, pick that contact.

This is better than plain text because short codes like `7275` can fail if Shortcuts tries to read them as normal phone numbers.

## How to run it

1. Open Shortcuts.
2. Tap `UAE Parking SMS`.
3. Type the parking code.
4. Type the number of hours.
5. If iPhone asks for permission, choose the option you want.

If you want it to send without asking each time, choose `Always Allow` when iPhone asks.

## How to use it with Siri

Siri can run a Shortcut by its name.

You do not need a new automation.

If the Shortcut name is:

```text
Pay Dubai Parking
```

Say:

```text
Hey Siri, Pay Dubai Parking shortcut
```

If the Shortcut name is:

```text
UAE Parking SMS
```

Say:

```text
Hey Siri, UAE Parking SMS shortcut
```

You can rename the Shortcut if you want a simpler phrase.

1. Open the Shortcuts app.
2. Find `UAE Parking SMS`.
3. Rename it to:

```text
Pay My Parking
```

4. Say:

```text
Hey Siri, Pay My Parking shortcut
```

## Message format

The Shortcut sends:

```text
Plate ParkingCode Hours
```

Example:

```text
ABC123 301 1
```

Many UAE parking SMS systems use this simple format, but not all of them do.

Check your city before you use it.

## How to test without paying

Use a fake parking code such as:

```text
301
```

or:

```text
302
```

Do not use a real parking code during a test if you do not want to pay.

The message may still be sent to the parking number if you allow it.

## How to build the Shortcut yourself

You need:

1. macOS
2. Node.js
3. Apple Shortcuts

Run:

```bash
npm install
npm run build
```

The Shortcut file will be made here:

```text
dist/UAE Parking SMS.shortcut
```

If you want to check for private data, run:

```bash
npm run check
```

## How the Shortcut works

The Shortcut has five steps:

1. Text: your plate number
2. Contacts: the parking SMS contact
3. Ask for Input: parking code
4. Ask for Input: hours
5. Send Message: send the SMS

The contact step matters.

Do not replace it with plain text like `7275`.

Shortcuts may drop short SMS codes if it tries to read them as normal phone numbers.

## How to change the default city

Open `scripts/build-shortcut.js`.

Change these lines:

```js
const defaultPlate = 'ABC123';
const defaultSmsNumber = '7275';
const defaultContactName = 'Dubai Parking';
```

Example:

```js
const defaultPlate = 'ABC123';
const defaultSmsNumber = 'YOUR_SMS_NUMBER';
const defaultContactName = 'Parking SMS';
```

Then run:

```bash
npm run build
```

## How to ask ChatGPT or Claude to help

You can paste this:

```text
I want to set up this Apple Shortcut repo:
https://github.com/OWNER/REPO

Please help me:
1. Check the README.
2. Help me build the Shortcut.
3. Make sure my real car plate is not committed.
4. Make the parking SMS number a contact, not plain text.
5. Test with a fake parking code like 301.
```

Tell the agent your city and parking SMS number.

Do not give the agent private data unless you want it to edit the Shortcut for you.

## Agent rules

If you are an AI agent working on this repo:

1. Do not commit a real car plate.
2. Do not commit a private phone number.
3. Keep `7275` only as the public Dubai default.
4. Keep the parking SMS number as a Contact action.
5. Do not change it to plain Text plus Get Phone Numbers.
6. Run `npm run check` before commit.
7. Test with fake parking codes like `301` or `302`.
8. Tell the user that a real SMS can cost money.

## Known limit

Apple may show a permission screen before the Shortcut sends a message.

This is normal.

If you choose `Always Allow`, it should stop asking.

## Files

```text
scripts/build-shortcut.js
```

Builds the Shortcut.

```text
scripts/check-private-data.js
```

Checks that private sample data was not left in the repo.

```text
dist/UAE Parking SMS.shortcut
```

The Shortcut file you can import.

## License

MIT
