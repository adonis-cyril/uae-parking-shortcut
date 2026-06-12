const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, '..', 'dist');
const unsignedPath = path.join(outputDir, 'UAE Parking SMS.unsigned.shortcut');
const binaryPath = path.join(outputDir, 'UAE Parking SMS.shortcut');

const defaultPlate = 'ABC123';
const defaultSmsNumber = '7275';
const defaultContactName = 'Dubai Parking';

const plateUUID = '11111111-1111-4111-8111-111111111111';
const contactUUID = '22222222-2222-4222-8222-222222222222';
const zoneUUID = '33333333-3333-4333-8333-333333333333';
const hoursUUID = '44444444-4444-4444-8444-444444444444';
const sendUUID = '55555555-5555-4555-8555-555555555555';

function variableAttachment(uuid, name) {
  return {
    OutputUUID: uuid,
    OutputName: name,
    Type: 'ActionOutput',
  };
}

function tokenString(string, attachmentsByRange = {}) {
  return {
    WFSerializationType: 'WFTextTokenString',
    Value: {
      string,
      attachmentsByRange,
    },
  };
}

function contactCard(name, phone) {
  return Buffer.from([
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Parking;UAE;;;',
    `FN:${name}`,
    `TEL;TYPE=CELL:${phone}`,
    'END:VCARD',
    '',
  ].join('\r\n'));
}

const workflow = {
  WFWorkflowClientVersion: '2700.0.4',
  WFWorkflowClientRelease: '7.0',
  WFWorkflowMinimumClientVersion: 900,
  WFWorkflowMinimumClientVersionString: '900',
  WFWorkflowName: 'UAE Parking SMS',
  WFWorkflowIcon: {
    WFWorkflowIconStartColor: 4282601983,
    WFWorkflowIconGlyphNumber: 59726,
  },
  WFWorkflowTypes: ['WatchKit', 'NCWidget'],
  WFWorkflowHasOutputFallback: false,
  WFWorkflowHasShortcutInputVariables: false,
  WFWorkflowInputContentItemClasses: [
    'WFStringContentItem',
    'WFPhoneNumberContentItem',
    'WFContactContentItem',
  ],
  WFWorkflowOutputContentItemClasses: [],
  WFWorkflowImportQuestions: [
    {
      ActionIndex: 0,
      Category: 'Parameter',
      ParameterKey: 'WFTextActionText',
      Text: 'What is your car plate number?',
      DefaultValue: defaultPlate,
    },
    {
      ActionIndex: 1,
      Category: 'Parameter',
      ParameterKey: 'WFContact',
      Text: 'What parking SMS contact should this send to?',
    },
  ],
  WFWorkflowActions: [
    {
      WFWorkflowActionIdentifier: 'is.workflow.actions.gettext',
      WFWorkflowActionParameters: {
        UUID: plateUUID,
        CustomOutputName: 'Plate Number',
        WFTextActionText: defaultPlate,
      },
    },
    {
      WFWorkflowActionIdentifier: 'is.workflow.actions.contacts',
      WFWorkflowActionParameters: {
        UUID: contactUUID,
        WFContact: {
          WFSerializationType: 'WFContactFieldValue',
          Value: {
            WFContactFieldValues: [
              {
                WFContactData: contactCard(defaultContactName, defaultSmsNumber),
                WFContactMultivalue: 0,
                WFContactProperty: 3,
              },
            ],
          },
        },
      },
    },
    {
      WFWorkflowActionIdentifier: 'is.workflow.actions.ask',
      WFWorkflowActionParameters: {
        UUID: zoneUUID,
        CustomOutputName: 'Parking Code',
        WFInputType: 'Text',
        WFAskActionPrompt: 'Parking code, for example 318C',
        WFAskActionDefaultAnswer: '',
      },
    },
    {
      WFWorkflowActionIdentifier: 'is.workflow.actions.ask',
      WFWorkflowActionParameters: {
        UUID: hoursUUID,
        CustomOutputName: 'Hours',
        WFInputType: 'Number',
        WFAskActionPrompt: 'How many hours?',
        WFAskActionDefaultAnswer: '1',
      },
    },
    {
      WFWorkflowActionIdentifier: 'is.workflow.actions.sendmessage',
      WFWorkflowActionParameters: {
        UUID: sendUUID,
        IntentAppDefinition: {
          TeamIdentifier: '0000000000',
          BundleIdentifier: 'com.apple.MobileSMS',
          Name: 'Messages',
          IntentClassName: 'INSendMessageIntent',
        },
        WFSendMessageActionRecipients: {
          WFSerializationType: 'WFTextTokenAttachment',
          Value: variableAttachment(contactUUID, 'Contacts'),
        },
        WFSendMessageContent: tokenString('\uFFFC \uFFFC \uFFFC', {
          '{0, 1}': variableAttachment(plateUUID, 'Plate Number'),
          '{2, 1}': variableAttachment(zoneUUID, 'Parking Code'),
          '{4, 1}': variableAttachment(hoursUUID, 'Hours'),
        }),
        ShowWhenRun: false,
      },
    },
  ],
};

(async () => {
  const plist = await import('plist');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(unsignedPath, plist.build(workflow));

  fs.copyFileSync(unsignedPath, binaryPath);
  console.log(`Built ${unsignedPath}`);
  console.log(`Built ${binaryPath}`);
})();
