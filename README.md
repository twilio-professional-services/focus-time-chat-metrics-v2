<a  href="https://www.twilio.com">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>
<br>
<br>

# Flex Focus Time with Chat Metrics

1. [Overview](#overview)
2. [What is included?](#what-is-included)
   1. [Focus Time](#focus-time)
   2. [Additional Chat Metrics](#additional-chat-metrics)
      1. [First Response Time](#first-response-time)
      2. [Average Response Time](#average-response-time)
      3. [Number of Agent Messages](#number-of-agent-messages)
      4. [Number of Customer Messages](#number-of-customer-messages)
      5. [Average Length of Agent's Messages](#average-length-of-agents-messages)
      6. [Average Length of Customer's Messages](#average-length-of-customers-messages)
3. [Getting Started](#getting-started)
   1. [Prerequisites](#prerequisites)
   1. [Local Setup](#local-setup)
   1. [Deployment & Release](#deployment)
      1. [Twilio Serverless Function](#deploying-the-twilio-serverless-function)
      1. [Plugin](#deploying--releasing-the-plugin)
4. [Expanding the Plugin](#expanding-the-plugin)

## Overview

The **Flex Focus Time with Chat Metrics** plugin provides functionality to measure focus time and additional metrics for chat related channels. All metrics are sent via [TaskRouter](https://www.twilio.com/docs/taskrouter) to [Flex Insights](https://www.twilio.com/docs/flex/end-user-guide/insights). This plugin is easy to expand to get even more metrics from chat channels. For more information in adding in additional metrics not included in this plugin, please see the [Expand the Plugin](#expand-the-plugin) section below.

_Note:_ This plugin is for Flex V2 (UI 2x) and was built in the structure of the [PS Template](https://github.com/twilio-professional-services/flex-project-template).

![chat insights](readme_images/chat_insights.png)

# What is included?

## Focus Time

Focus Time is a metric that measures time spent on each reservation. In a multi-tasking scenario where an Agent is working multiple interactions at the same time, this plugin will track the "in focus" time for each task instead of just the task duration.

The logging stops as soon as the task enters the Wrapup state. Unlike in the [plugin-handleTimeTracker](https://github.com/lehel-twilio/plugin-handleTimeTracker) solution, this plugin uses browser local storage, therefore, it's resilient against browser refreshes.

![flex reservations](readme_images/multiple_reservaitions.png)

The focus time is calculated for all channels and, by default, the **focus_time** attribute is used and recommended for Flex Insights.

## Additional Chat Metrics

Together with the Focus Time, there are additional metrics that can be enabled for chat-related channels:

### First Response Time

- duration in seconds between a reservation is accepted and first message is sent by agent
- by default **first_response_time** atribute is used for Flex Insights

### Average Response Time

- average duration in seconds between customer message and agent's first following message
- first agent's message duration is excluded, because it would include queue time (customer sends first message > waiting in queue > agent accept reservation > first message sent)

### Number of Agent Messages

- number of messages sent by Agent

### Number of Customer Messages

- number messages sent by Customer
- if there is transfer or longlived channels configured then the function needs to be enhanced to exclude other agent(s) too

### Average Length of Agent's Messages

- average number of characters in agent's messages

### Average Length of Customer's Messages

- average number of characters in customer's messages
- if there is transfer or longlived channels configured then the function needs to be enhanced to exclude other agent(s) too

# Getting Started

To get up and running locally, follow the instructions listed below. Additionally, take a look at the prerequisites to prepare for setup and use.

### Prerequisites

- You are running `node v16` or above
- `twilio cli 5.2.0` or above is [installed](https://www.twilio.com/docs/twilio-cli/getting-started/install) (`twilio --version`)
- `twilio flex plugins 6.0.2` or above is [installed](https://www.twilio.com/docs/flex/developer/plugins/cli/install#install-the-flex-plugins-cli) (`twilio plugins`, `twilio plugins:install @twilio-labs/plugin-flex@latest`)
- `twilio serverless plugin 3.0.4` or above is [installed](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started#install-the-twilio-serverless-toolkit) (`twilio plugins` `twilio plugins:install @twilio-labs/plugin-serverless@latest`)
- `twilio profiles:list` has an active account set.
- Have the twilio auth token for your account ready (you can find this in the [Twilio Console](https://console.twilio.com/))

---

## Local Setup

1. Prior to beginning setup, ensure the Twilio CLI has the correct account set to active:

   ```
   twilio profiles:list
   ```

2. At the root of the directory, install package dependencies (this installs all sub-project package dependencies and generates the `.env` configuration for you):

   ```
   npm install
   ```

3. Follow the prompts in the CLI and provide your Auth Token for your active Twilio account.

4. Update the `ui_attributes` file for your specific environment within the `./flex-config` directory:

   ```json
   {
     "custom_data": {
       "features": {
         "focus_time_chat_metrics_v2": {
           "enabled": true,
           "additional_features_channels": ["chat"],
           "focus_metric": "focus_time",
           "additional_features": {
             "firstAgentResponse": "first_response_time",
             "averageResponseTime": "average_response_time",
             "agentMessages": "conversation_measure_6",
             "customerMessages": "conversation_measure_7",
             "averageAgentLength": "conversation_measure_8",
             "averageCustomerLength": "conversation_measure_9"
           }
         }
       }
     }
   }
   ```

   - See available Flex Insights metric attributes in [Twilio Documentation](https://www.twilio.com/docs/flex/developer/insights/enhance-integration#add-custom-attributes-and-measures) (metrics has number as the value)
   - If you do not want to use a specific metric/feature then configure the value to 'null'; an example of disabling features/metrics:

     ```json
     "additional_features": {
         "firstAgentResponse" : "first_response_time",
         "averageResponseTime": "average_response_time",
         "agentMessages": "null",
         "customerMessages": "conversation_measure_7",
         "averageAgentLength": "null",
         "averageCustomerLength": "null"
     }
     ```

5. Now deploy the updated Flex Configuration by navigating to the `./flex-config` directory and running the following:

   ```
   cd flex-config && npm run deploy:local
   ```

6. Lastly, to run the plugin locally, run the following command within the root directory:
   ```
   npm run start:local
   ```

---

## Deployment

To deploy the plugin and serverless functions, follow the instructions below.

### Deploying the Twilio Serverless function

1. Ensure the proper environment variables are set within the `serverless-functions` directory (e.g. `.env`):

   ```
   ACCOUNT_SID=
   AUTH_TOKEN=
   TWILIO_CHAT_SERVICE=
   ```

2. Then change directories to `./serverless-functions` and deploy the project using Twilio Cli:

   ```
   cd serverless-functions
   twilio serverless:deploy
   ```

3. Upon successful deployment, populate the serverless domains deployed above into the config within the `./flex-config` directory.

   ```
   cd ..
   npm run populate-missing-placeholders <environment>
   ```

   _Note:_ If you customized `custom_data` in `appConfig.js` while running locally, and would like to deploy with those settings, be sure to make the same changes in your `flex-config/ui_attributes.<environment>.json` file as well.

4. Lastly, deploy the new configuration:
   ```
   cd flex-config
   npm run deploy:<environment>
   ```

### Deploying & Releasing the Plugin

Begin the deployment by navigating to the plugin directory (`./flex-template-focus-time-chat-metrics-v2`) and running the following:

```
cd flex-template-focus-time-chat-metrics-v2
twilio flex:plugins:deploy --major --changelog "Initial deploy" --description "Focus Time Chat Metrics v2"
```

After your deployment runs you will receive instructions for releasing your plugin from the bash prompt. You can use this or skip this step and release your plugin from the [Flex plugin dashboard](https://flex.twilio.com/admin/plugins).

For more details on deploying your plugin, refer to the [Deploying your Plugin](https://www.twilio.com/docs/flex/plugins#deploying-your-plugin) guide.

# Expanding the Plugin

This plugin is easy to expand with your own calculations on chat-related channels transcripts. If you want to know for example, how many times your agent or customer mentioned your product _X_, then only two steps are required:

1. Add a new configuration item together with the metric attribute to be useed in Flex Insights into **FEATURES** object

   ```json
   "additional_features": {
       "firstAgentResponse" : "first_response_time",
       "averageResponseTime": "average_response_time",
       "agentMessages": "conversation_measure_6",
       "customerMessages": "conversation_measure_7",
       "averageAgentLength": "conversation_measure_8",
       "averageCustomerLength": "conversation_measure_9",
       "productMentioned": "conversation_measure_4"
   }
   ```

2. Add the code to the function (with condition that check the FEATURES key)

   ```javascript
   // custom product mentioned
   if (configuredFeatures["productMentioned"] !== null) {
     //code
     const numberProductMentioned = 10; // mocked result
     attributesUpdateJSON.conversations[
       configuredFeatures["productMentioned"]
     ] = numberProductMentioned;
   }
   ```

With these two steps you get your new metric into the TaskRouter task which will populate within Flex Insights. Please note that there is a limited amount empty metric attributes to be used in [Flex Insights](https://www.twilio.com/docs/flex/developer/insights/enhance-integration#add-custom-attributes-and-measures).
