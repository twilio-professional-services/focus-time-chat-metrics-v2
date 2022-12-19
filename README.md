# Flex Focus Time with Chat Metrics

![chat insights](readme_images/chat_insights.png)

# Overview

Flex plugin to measure focus time and additional metrics for chat related channels. All metrics are sent via taskrouter to Flex Insights. This plugin is easy to expand to get even more metrics from chat channels.

This plugin is compatible built for Flex V2 (UI 2x) and it was built in the structure of [PS Template](https://github.com/twilio-professional-services/flex-project-template)

# Focus Time

Focus Time is a metric that measures time spent on each reservation. In a multi-tasking scenario where an Agent is working 
multiple interactions at the same time, this plugin will track the "in focus" time for each task instead of just the task duration. 
The logging stops as soon as the task enters the Wrapup state. Unlike in https://github.com/lehel-twilio/plugin-handleTimeTracker, this plugin uses
browser local storage, therefore, it's resilient against browser refreshes.

![flex reservations](readme_images/multiple_reservaitions.png)

The focus time is calculated for all channels and, by default, the **focus_time** attribute is used and recommended for Flex Insights.
   
# Additional Chat Metrics

Together with the Focus Time, there are additional metrics that can be enabled for chat-like channels:

### First Response Time

* duration in seconds between a reservation is accepted and first message is sent by agent
* by default **first_response_time** atribute is used for Flex Insights

### Average Response Time

* average duration in seconds between customer message and agent's first following message
* first agent's message duration is excluded, because it would include queue time (customer sends first message > waiting in queue > agent accept reservation > first message sent)

### Number of Agent Messages

* number of messages sent by Agent

### Number of Customer Messages

* number messages sent by Customer
* if there is transfer or longlived channels configured then the function needs to be enhanced to exclude other agent(s) too

### Average Length of Agent's Messages

* average number of characters in agent's messages

### Average Length of Customer's Messages

* average number of characters in customer's messages
* if there is transfer or longlived channels configured then the function needs to be enhanced to exclude other agent(s) too

# Configuration

### Deploy the Twilio Serverless Service

1. Set the environment variables (.env) 
```
ACCOUNT_SID=
AUTH_TOKEN=
TWILIO_CHAT_SERVICE=
```

2. Deploy the serverless project using Twilio Cli:  
```
twilio serverless:deploy
```

### Configure and Deploy the Plugin

1. Set configuration in Flex Environment (/flex-config)
* rename **config.sample.js** to **config.js**
```
{
  "custom_data": {
    "features": {
      "focus_time_chat_metrics_v2": {
        "enabled": true,
        "additional_features_channels": ["chat"],
        "focus_metric": "focus_time",
        "additional_features": {
          "firstAgentResponse" : "first_response_time",
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

* see available Flex Insights metric attributes in [Twilio Documentation](https://www.twilio.com/docs/flex/developer/insights/enhance-integration#add-custom-attributes-and-measures) (metrics has number as the value)
* if you do not want to use any feature then configure value to 'null'
* an example of disabling features:

```
        "additional_features": {
          "firstAgentResponse" : "first_response_time",
          "averageResponseTime": "average_response_time",
          "agentMessages": "null",
          "customerMessages": "conversation_measure_7",
          "averageAgentLength": "null",
          "averageCustomerLength": "null"
        }
```
2. Deploy and Release the Plugin

# Expand the Plugin

* this plugin is easy to expand with your own calculations on chat-like channels transcripts
* if you want to know for example, how many times your agent or customer mentioned your product X then only two steps are required

1. add a new configuration item together with the metric attribute to be useed in Flex Insights into **FEATURES** object
```
        "additional_features": {
          "firstAgentResponse" : "first_response_time",
          "averageResponseTime": "average_response_time",
          "agentMessages": "conversation_measure_6",
          "customerMessages": "conversation_measure_7",
          "averageAgentLength": "conversation_measure_8",
          "averageCustomerLength": "conversation_measure_9",
          "productMentioned": 'conversation_measure_4'
}
```

2. add the code to the function (with condition that check the FEATURES key)
```
    // custom product mentioned 
    if (configuredFeatures['productMentioned'] !== null) {
    //code
    const numberProductMentioned = 10 // mocked result
    attributesUpdateJSON.conversations[
              configuredFeatures["productMentioned"]
            ] = numberProductMentioned;
    }
```

* with these two steps you get your new metric into taskrouter task => Flex Insights
* please note that there is a limited amount empty metric attributes to be used in [Flex Insights](https://www.twilio.com/docs/flex/developer/insights/enhance-integration#add-custom-attributes-and-measures)
