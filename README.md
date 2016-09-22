## Smartface.io Platform Official Todo Application Example

![Home Page](/docs/images/home.png) ![New Todo Page](/docs/images/new_todo.png)

### Application Skeleton
- App.js
  - Application base
- Main.js
  - requirejs base
- App folder
  - Smartface Core   
- Pages folder
  - Application modules
- Pages/Components
  - Includes application specific components
- App/Domain
  - Includes data stores and bussiness services
- App/Component
  - Includes platform specific components
- App/Core
  - Includes platform javascript sdk
- Libs
  - Includes 3rd party script bundles

## Application Architecture
MVC pattern applied. Stores responsible for all data logic and data side effects and components update from stores via Rxjs.

### Data Flow
There is a unidirectional data flow between views and stores. Stores and views are independent nodes with distinct inputs and outputs.

### View Layer ###
- **Page**
  - Pages are view-controllers drives native page controls and mediates between user interactions to application services
- **Block**
  - Blocks are UI Components but blocks differently mediate between components and pages for ui needs. Blocks get user interactions and updates application services. stores and components. Components encapsulate common ui behaviors, blocks encapsulate ui behaviors in page that reduces and shares page-controller complexity. For example: DataList is a component but todo data list is block as well as includes different component like tab button pane etc.
- **Components**
   - Components are ui containers that encapsulate common behaviors of UI needs. Usually components should be updated by blocks or pages. Components transfer user interactions to block or pages.

### Stores ###
Stores contain the application state and logic. Their role is somewhat similar to a model in a traditional MVC, but they manage the state of many objects. Stores manage the application state for a particular domain within the application.

### Installation ###
[Start with smartface](https://smartface.atlassian.net/wiki/pages/viewpage.action?pageId=8486965)
