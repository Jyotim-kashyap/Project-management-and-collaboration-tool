import React from "react";
import { Tabs } from "antd";
import "./Home.css";

const { TabPane } = Tabs;

function TextBlock() {
  return (
    <div id="textblock">
      <div id="textblock-container">
        <h1 id="textblock-title">Key Features</h1>
        <Tabs defaultActiveKey="1" centered tabBarGutter={50} className="textblock-tabs">
      <TabPane className="tab-text" tab="Backlog" key="2">
        <p  className="luckiest-guy-2">
          The backlog is a prioritized list of tasks, user stories, or features that need to be completed in a project. It represents the work that has not yet been assigned to a specific iteration or sprint. The backlog is typically managed and prioritized by the product owner, who works closely with the development team to ensure that the most important items are addressed first. It serves as a single source of truth for all the work that needs to be done, allowing the team to plan and estimate their work effectively.
        </p>
      </TabPane>
      <TabPane  className="tab-text" tab="ScrumPoker" key="3">
        <p className="luckiest-guy-2">
          ScrumPoker, also known as planning poker, is a technique used by agile teams to estimate the effort or relative size of user stories or tasks. It is a collaborative approach where each team member holds a set of cards with numbers representing different levels of effort. The team discusses the requirements of a user story, and then each member privately selects a card indicating their estimation. After everyone has made their selection, the cards are revealed simultaneously. If there is a wide variation in the estimates, the team discusses the reasons behind the differences and repeats the process until a consensus is reached.
        </p>
      </TabPane>
   
      <TabPane className="tab-text" tab="Reports" key="5">
      <p className="luckiest-guy-2">
          Reports play a vital role in project management and software development, providing structured documents or summaries that offer valuable insights into various aspects of a project or system. Reports aid in effective communication, tracking progress, identifying issues, and facilitating decision-making. We utilize three types of reports: Velocity, Burn-up, and Burn-down reports.
        </p>
      </TabPane>
      <TabPane className="tab-text" tab="Logs" key="4">
        <p className="luckiest-guy-2">
          Logs, in the context of software development, refer to recorded events or messages that provide information about the execution of a program or system. Logging is a critical practice for troubleshooting, monitoring, and understanding the behavior of an application. Developers can include log statements at strategic points in the code to capture relevant information, such as error messages, performance metrics, or specific actions taken by the application. Logs are typically stored in files or sent to a centralized logging system, where they can be analyzed and used for debugging or auditing purposes.
        </p>
      </TabPane>
    </Tabs>
      </div>
    </div>
  );
}

export default TextBlock;
