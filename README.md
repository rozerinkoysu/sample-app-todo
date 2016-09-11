## Smartface Platform Tofo Application Example

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

##### Application Architecture
Inspired from Facebook Flux's one way flow implemantation. Stores responsible for all data logic and data side effects and components update from stores via Rxjs.
