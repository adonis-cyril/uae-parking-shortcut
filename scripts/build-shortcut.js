const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const outputDir = path.resolve(__dirname, '..', 'dist');
const unsignedPath = path.join(outputDir, 'UAE Parking SMS.unsigned.shortcut');
const binaryPath = path.join(outputDir, 'UAE Parking SMS.shortcut');

const defaultPlate = 'ABC123';
const defaultSmsNumber = '7275';
const defaultContactName = 'Dubai Parking';

const contactUUID = randomUUID().toUpperCase();
const plateUUID = randomUUID().toUpperCase();
const zoneUUID = randomUUID().toUpperCase();
const hoursUUID = randomUUID().toUpperCase();
const sendUUID = randomUUID().toUpperCase();

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
