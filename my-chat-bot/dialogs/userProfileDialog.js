// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { MessageFactory } = require('botbuilder');
const {
    AttachmentPrompt,
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    ConfirmPrompt,
    DialogSet,
    DialogTurnStatus,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');
const { Channels } = require('botbuilder-core');
const { UserProfile } = require('../userProfile');

const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class UserProfileDialog extends ComponentDialog {
    constructor(userState) {
        super('userProfileDialog');

        this.userProfile = userState.createProperty(USER_PROFILE);

        this.addDialog(new TextPrompt(NAME_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.nameStep.bind(this),
            this.optionsStep.bind(this),
            this.sectorStep.bind(this),
            this.countryStep.bind(this),
            this.timePreferenceStep.bind(this),
            this.confirmStep.bind(this),
            this.summaryStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }


    async nameStep(step) {
        return await step.prompt(NAME_PROMPT, 'Please enter your name.');
    }

    async optionsStep(step) {
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.

        step.values.name = step.result;

        // We can send messages to the user at any point in the WaterfallStep.
        await step.context.sendActivity(`Thanks ${ step.result }. `);

        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'How can I help you?',
            choices: ChoiceFactory.toChoices(['Find a Mentor', 'Find a Grant'])
        });
    }

    async sectorStep(step) {
        step.values.option = step.result.value;

        // We can send messages to the user at any point in the WaterfallStep.

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(CHOICE_PROMPT, `Great ${step.values.name}! I can help you with that! Now what sector do you want to work in?`, ['Non-profit', 'Education']);
    }


    async countryStep(step) {
        step.values.sector = step.result.value;
        return await step.prompt(CHOICE_PROMPT, `Where do you live?`, ['USA', 'Africa', 'Caribbean', 'Other']);
    }

    async timePreferenceStep(step) {
        step.values.country = step.result.value;
        return await step.prompt(NAME_PROMPT, `Ooh, that's amazing! Anyway, what’s your time zone?`);
    }

    async confirmStep(step) {
        step.values.timeZone = step.result;

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(CONFIRM_PROMPT, { prompt: 'Is this okay?' });
    }

    async summaryStep(step) {
        if (step.result) {
            // Get the current profile object from user state.
            const userProfile = await this.userProfile.get(step.context, new UserProfile());

            userProfile.name = step.values.name;
            userProfile.option = step.values.option;
            userProfile.sector = step.values.sector;
            userProfile.country = step.values.country;
            userProfile.timeZone = step.values.timeZone;

            let msg = `Your name is ${ userProfile.name }, you work in the ${ userProfile.sector.toLowerCase() } sector and you need my help ${ userProfile.option.toLowerCase() }. Your country is ${ userProfile.country } and your time zone is ${ userProfile.timeZone }`;

            msg += '.';
            await step.context.sendActivity(msg);
        } else {
            await step.context.sendActivity('Thanks. Your profile will not be kept.');
        }

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is the end.
        return await step.endDialog();
    }

}

module.exports.UserProfileDialog = UserProfileDialog;
