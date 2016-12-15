<h3 align="center">
  <img height=75 src="https://github.com/rozerinkoysu/sample-app-todo/blob/master/temp/smartface_logo.png" alt="smartface Logo" />
</h3>

# A sample To-Do application from Smartface
[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/smartface/sample-app-todo/blob/master/LICENSE)

To-Do application from Smartface is a sample app to demonstrate how to use Smartface objects according to [js-base](https://github.com/smartface/js-base). You can freely use the code in your apps.

![alt tag](https://github.com/rozerinkoysu/sample-app-todo/blob/master/home_.png)

![alt tag](https://github.com/rozerinkoysu/sample-app-todo/blob/master/temp/new_todo.png)

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

## Dependencies

This repository depends on [smartface.io](https://smartface.io) runtime.
You need to clone this repository inside a [**Smartface.io Cloud IDE Workspace**](https://cloud.smartface.io/Home/Index)

## Need Help?

Please [submit an issue](https://github.com/smartface/sample-app-todo/issues) on GitHub and provide information about your problem.

## Support & Documentation & Useful Links
- [Guides](https://www.smartface.io/guides)
- [API Docs](https://docs.smartface.io)
- [Smartface Cloud Dashboard](https://cloud.smartface.io)
- [Download Smartface On-Device Emulator](https://smf.to/app) (Works only from your device)

## Code of Conduct
We are committed to making participation in this project a harassment-free experience for everyone, regardless of the level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.
Please read and follow our [Code of Conduct](https://github.com/smartface/sample-self-service/blob/master/CODE_OF_CONDUCT.md).

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file.


