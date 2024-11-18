# Implementation Notes

## WebUI (NextJS, ShadCN, Tailwind)

##### Background & Motivation

> The web UI will form a single interface to access all services (via the core Nestjs backend). 

##### Purpose & Scope

> This section documents key design, challenges and implementation steps taken in the development of the web UI to the application.

##### Note: Design Decisions

> **Decision 1: Fullstack architecture implemented with Next.JS (ShadCN)**
> 
> As the first step of designing a web application was to decide the category of Web Appliction best suited to our needs.
>
> Requirements:<br>
>> We need our web app to cater to the following requirements:
>> - Dynamic
>>> Since We need to be able to interact with our data (image viewing, summary statistics, UX, etc.) we need the web ui to offer an app-like UX.
>> - Large data volumes collated from different sources. 
>>>This can include EHR, Image etc data. To collate, combine, pre-process, etc. this data, it can be expected that significant compute resources are required. 
>> - Sensitive data
>>> Since the data we are processing is generated in a hospital setting, it not only falls into the "personal data" category but is classified as sensitive. This means that the data iself, as well as e.g. credentials etc needed to access it should be protected effectively.    
>
>  Archtiectures:<br>
>>
>> Different categories (and sub-categories) web app architectures exist that offer different capabilities. The choice of architecture is important to inform the choice of framework we use to build it. The main categories of architectures are summarized below:
>> 
>> 1. Back-end only (document-centric):<br>
>> - Focuses on server-side processing and data management
>> - Excels in applications requiring complex data processing
>> - Limited by client-side capabilities and potential security risks
>> 2. Front-end only (React, SPA):<br>
>> - Emphasizes dynamic, interactive user interfaces
>> - Enables real-time updates without page reloads
>> - Limited by browser processing power and security constraints
>> 3. Full stack:<br>
>> - Combines front-end interactivity with back-end processing
>> - Allows for secure data handling while providing dynamic UI
>> - Offers flexibility and scalability for complex applications
>>
> Design Decision:<br>
>> We've opted for a full stack approach because it offers:
>>
>> - Enhanced Security:
>>> - Sensitive data remains on the server, reducing exposure
>>> - Minimizes risks associated with client-side processing
>> - Improved Performance:
>>> - Heavy computations and data manipulations handled efficiently on the server
>>> - Faster response times for complex operations
>> - Dynamic User Experience:
>>> - Enables real-time interactions and responsive interfaces
>>> - Allows for seamless viewing of images and other content
>
> Key considerations:<br>
>>
>> When designing the web application it is essntial to clearly define and adhere to a delineation of responsibilities of the various components comprising the web app:
>> -  Web App vs. Backend servers
>>> Although it is not uncommon for the back end server of a full stack web app to take over a range of processing responsibilities (e.g. Authentication/Authorization/Access controls; Data collation & pre-processing; etc.) in this application the web ui will ONLY be responsible for generating and displaying the web UI. All other tasks (i.e. anything to do with auth or data being displayed) will be outsourced to dedicated services that, in turn, are integrated via the core (NestJS) backend server. 
>>>> *Aside:*<br> 
>>>><small>*This architecture can be seen as an upfront investiment of complexity. Take Auth as an example: Auth requires the client attaching a cookie/JWT/etc to requests to identify the user and auth status to the server. These tokens are "same-site" and therefore cannot directly be forwarded by an intemediary to another server as a security feature. The challenge with this is that the fe-be communication in a web app is between the client browser and the web app server - so if auth is outsourced to another dedicated server appropriate steps need to be taken to enable this.*</small> 
>>>
>>> Most tools and tutorials assume that the web app back end will handle auth, data fetching/processing etc. and therefore be designed accordingly (same site cookied, auth frameworks etc.). This is possible because most web applications are limited and scope and complexity - and therefore this upfront investment can rarely be justified. Outsourcing these specialist tasks to dedicated servers requires additional logic to be implemented. However, by adhering to the SRP this also makes the application more flexible, scalable and, most importantly, capable of dealing with the complex workflows needed to cater to the security/data requirements required in this application.
>>
>> -  Web App Front End vs. Back End 
>>> The majority of data fetching, processing, session management etc will be assigned to the back end leaving the front end to handle interactivity only. The goal is to keep the front end simple and outsource as much as possible to the back end. In addition to keeping the front end simple (passive, state management, etc) this also has the advantages that unlike individual browsers we control the back end (i.e. can scale up if needed), and minimize the amount of potentially sensitive data that needs to be transferred via the web between the server and the client.
>> 
>> Summary
>>>  The web application 
>>> - Majority of data processing occurs on the server
>>> - Clear separation between front-end rendering and back-end logic
>>> - Flexible architecture for future scalability and maintenance
>>> By adopting a full stack approach, we can create a secure, performant, and interactive web application tailored to our specific requirements while maintaining flexibility for future enhancements.

##### Note: Tooling Decisions
> 
> - **Framework: NextJS (ReactJS)**<br> NextJS will be used to implment the full stack web application. This is a widely used platform recommended by ReactJS. It caters to multiple sub-categories of full stack web applications (SSG, SSR, etc.).
> - **Component Library: ShadCN**<br>
ShadCN is well integrated with Vercel (NextJS) and offers a novel approach to component libraries: rather than providing a number of components to select from it allows you to integrate component code. This means the components provided represent the starting point for developing your own components (rather than the take-it-or-leave it approach of other component libraries).<br>
For a helpful overview, see: https://www.youtube.com/watch?v=TBIjgBVFjVI 
> - **Styling Library: Tailwind CSS**<br>
Tailwind is a library that helps manage the impedance mismatch between HTML (bottom-up structure) and CSS (Top-down cascade). It is one of several initiatives to address this (e.g. component library approach, CSS-in-JS approach, etc.) but, perhaps due to its conceptual simplicity, appears to have prevailed as the preferred strategy. This makes it widely adopted and future proof.

##### Note: Initial (boilerplate project) Setup

> NB: Here we use the <span style="background-color:yellow, color:black">ShadCN installer (rather than the NextJS installer (npx create-next-app@latest)) as this will ensure a seamless ShadCN-NextJS integration</span>

> 1. Trigger the instaniation of a NextJS (ShadCN) boilerplate project 
> ```bash
> cd [project root]
> npx shadcn@latest init
> ```

> 2. Follow on-screen menu:
>```
> - ✔ The path [...] does not contain a package.json file. Would you like to start a new Next.js project? …                                                       yes
> - ✔ What is your project named? …                              core-ui
> - ? Which style would you like to use:                         New York
> - ? Which color would you like to use as the base color?:      Slate
> - ✔ Would you like to use CSS variables for theming? …         yes
>```
>
>> <small>Alternatively, the STANDARD NextJS CLI command and menu are:
>> ```bash
>> cd [project root]
>> npx create-next-app@latest
>> ```
>>
>> ```
>> -> ✔ What is your project named? …                        core_ui
>>    ✔ Would you like to use TypeScript? …                  Yes
>>    ✔ Would you like to use ESLint? …                      Yes
>>    ✔ Would you like to use Tailwind CSS? …                Yes
>> -> ✔ Would you like your code inside a `src/` directory?… No
>>    ✔ Would you like to use App Router? (recommended) …    Yes
>>    ✔ Would you like to use Turbopack for next dev? …      No
>>    ✔ Would you like to customize the import alias (@/* by default)? … No
>> ```
>> </small>

> 3. Optional: Review the files created
> ```
> .
> ├── .eslintrc.json
> ├── .gitignore
> ├── README.md
> ├── app
> │   ├── favicon.ico
> │   ├── fonts
> │   ├── globals.css
> │   ├── layout.tsx
> │   └── page.tsx
> ├── components.json
> ├── lib
> │   └── utils.ts
> ├── next-env.d.ts
> ├── next.config.mjs
> ├── node_modules
> ├── package-lock.json
> ├── package.json
> ├── postcss.config.mjs
> ├── tailwind.config.ts
> └── tsconfig.json
> ```
>
>> Key Files/Folders: 
>>> Project setup 
>>> - `package.json`: scripts (build/start/run app in dev/test mode), dependencies etc.
>>> - `next.config.mjs`: NextJS configurations. Empty for now, but allows us to configure our NextJS application
>>
>>> Language Configurations
>>> - `tsconfig.json`: Typescript configuration
>>> - `eslintrc.json`: Linting rules (`next/core-web-vitals` is a set of linting rules; these rules can be extended/modified here) 
>>>
>>> CSS configurations
>>> - `app/globals.css`: sets default CSS for the starter components
>>> - `tailwind.config.ts`: <br>
>>> Tailwind (styling) configurations - tells the styling frameworks wwhere to look for components, set global styles (themes), add plugins, etc. 
>>> - `postcss.config.js`: <br>
>>> ?
>>
>>> **The application (app/)**
>>> - <span style="color:red">The app router components: `layout.tsx`, `page.tsx`. 
>>>> `page.tsx`: <br>Pages are the public UI that is displayed when a user browses to the route corresponding to the path of the `page.tsx` file. (*NB Not every route needs to have a page - in some cases we may want to have a route that is only accessible internally and this can be achieved by implementing the route folder but not having a `page.tsx`*).<br> 
>>>
>>>> `layout.tsx`: <br>**Layouts are UI's that are shared between multiple routes. When we navigate between routes the layout components (including their STATE) gets preserved and they dont re-render.** Layout component contain a children prop which automatically wraps the `page.tsx` in the same/subfolders and/or other layouts. Within Layouts, pages are `{children}`. (*NB: This is a key difference between the new "app router" and "pages router" it replaces: due to the existance of the `layout.tsx` files, the folder structure of the app router is governed by shared layouts rather than functional similarities (although pages that are similar at a functional level often also share a layout... In order to design your API properly you need to understand the through process behind this decision!)*</span> 
>>> - The global CSS styles (see `app/globals.css` above)
>> 
>> <br>
>>
>> Key differences to conventional NextJS (`npx create-next-app@latest`) boilerplate project
>>> 
>>> 1. Absence of a `.next/` folder
>>> 2. Addition of a `components.json` file
>>> 3. Addition of a `lib/utils.ts` folder/file
>>> 4. Absence of a `public/` folder (Any assets (favicon etc.) were stored here.)


> 4. Optional: Test-run the boilerplate project
>
> `npm run dev`

> 5. Recommended: Clean up boilerplate code
> 
>> `app/page.tsx`<br>
>> Remove all of the boilerplate code inside the return () (you can add a placeholder so something is displayed).
>
>> `app/globals.css`<br>
>> These presumably implement the styling we requested ("New York" and "Slate") It therefore makes sense to keep these - but if you want to change the styles you can remove everything apart from the Tailwind directives at the top (*These are needed to integrate Tailwind in our project*). 
>>> ```
>>> @tailwind base;
>>> @tailwind components;
>>> @tailwind utilities;
>>> ```
>> NB When setting up a NextJS project without ShadCN we typically remove all the global CSS (apart from Tailwind directives)

<br>

##### Note: Adding a simple login form/route 

Next, as a proof of concept, we explore the workflow to add a new route in NextJS, and a corresponding UI using ShadCN. Specifically we add a login form.

**NB: Scope**
> *This does NOT yet incude the auth logic - we only want to explore the creation of front ends in the NextJS-ShadCN setup* 

**NB: Divergence from Tutorial**
> *The tutorial uses MUI and emotion to implement the front end. I prefer using ShadCN and therefore have set up the project accordingly (see above). For compleness sake, the tutorial intalled the following libraies (I did not):*
> 
> `npm i --save @mui/material @mui/material-nextjs @emotion/react @emotion/styled @emotion/cache` 
>
> We then wrap our entire front end application (the "`children`" in the root level layerout.tsx) with the styling component `AppRouterCacheProvider`, `ThemeProvider` provided by `@mui/material-nextjs/v13-appRouter` to apply styles globally (theming). <br><br>
> ShadCN uses a different approach (below): https://www.youtube.com/watch?v=LEFRcCf4ehc @7:40 

**NB: Theming**
> There are several approaches we can use to apply themes. We can create a dedicated theming component or we can use the global CSS. 
>
> Ideally, users should be able to select their own theme - to achieve this, if our application applies server side renering it should NOT apply themes on the server - instead the theme should be set client side. (See lesson 3 @3:00 for details.)

> **Creating new routes (NextJS)**
>
> We will create 2 routes: the login route and the landing page route.

> **Creating login form (shadCN)**
>
> Once our routes are available we can add components to them. ShadCN has "blocks" (https://ui.shadcn.com/blocks) which are pre-built higher-order widgets like login screens that we can use right out of the box. Using the command:
>> `npx shadcn add login-01`
> you install the login block and all associated components and stylings.


> **Creating & Linking remaining auth forms (signup, login, forgot password forms (shadCN)**
> While ShadCN provides a login form "block", it does not offer blocks for sign up, or forgot password. There are 2 approaches we can take to provide them:
> 1. Copy & modify the login form
> 2. Use V0 to autogenerate the component/block and import. This generates a link you can use in `npx shadcn add [...]` 
> -> See https://www.youtube.com/watch?v=IV6sChTZFLQ&pp=ygUraSBjcmVhdGVkIG15IG93biBjb21wb25lbnRzIHdpdGggc2hhZGNuIGNsbw%3D%3D
>
> Here, we opted for the former.
>
> In addition to creating the forms, we also implemented links that allow us to move to the various pages.

> NB: Scope:
> We have NOT yet implemented the underlying functionalities - ToDo's have been added.

> **Apply Theme**
> To apply a theme in ShadCN simply go to the theme page (https://ui.shadcn.com/themes), select the theme settings (color: blue; radius: 0.5; mode: dark) and copy to replace the existing theme into `app/globals.css` `(@layer base {:root {...)`
>
>> Tip:
>>
>>> If the theme does not get applied, make sure the app/layout.tsx is set up correctly

---
---
---

## Backend Server (NextJS, PostgreSQL {incl. postgres.app, pgAdmin, psql, dBeaver})

##### Background & Motivation

In the previous section we implemented a simple full stack web UI. Since our application is meant to scale, the back end of this full stack web app will NOT be used for business logic - the web app will only be used for the UI. Instead, the business logic will be implemented on a dedicated server that we will implement using NestJS. 

> <div style="color:red">**NOTE: NestJS back end vs NextJS back end**
> In order to keep our architecture clean, we need to clearly delineate and distinguish between the roles of the NestJS back end server and the NextJS back end server. The NextJS will handle "***Server Actoins***" that have to do with rendering etc the UI. The NestJS back end server, on the other hand, will deal with business logic (e.g. Auth, PKDB etc.), data persistence, etc.
> </div>

##### Purpose & Scope

To set up the central back end application server. This includes:
1. Instantiating a NestJS project
2. Implementing a data persistence layer (i.e. Postgres Database; Prisma ORM; Schema/Migrations etc)
3. Implementing services and integrating them with the Web App  
-  3.1 Auth Service


##### Note: Setting up a NestJS project

> **Install NestJS CLI (globally)**
> 
> `npm i -g @nestjs/cli@latest`
>
> Note: I dont like global installs. I would typ do this in a devcontainer, but to keep things simple here I'll just follow this recommended instruction (<span style="background-color:red">Uninstall after this project!</span>)

> **Create a new NestJS project**
>
> 1. Create a new project: `nest g core-be`
> 2. Select package manager: npm
>> <div style="color:red">WARNING: <br>
>> This will set up a new project, complete with its own git repo (i.e. you cannot use your exisitng repo to VC this module.)<br><br>You can, of course, also create the NestJs app as a separate project (and e.g. submodule it)</div>
> 3. cd into the project and review boilerplate project.


##### Note: Review the boilerplate

> **src directory**
>> **main.ts**<br>
>> The application entry point: it defines a bootstrap function that, in turn, sends the AppModule (below) to the NestJS factory to spin up the back end application, and then listens on a port. It then calls the bootstrap function to execute it.
>>
>> **NB: change the port (e.g. to 3001) since we already have NextJS listening on port 3000.**
> 
>> **app.module**<br>
>> The app module is the integration point where we import all the dependencies within our app (i.e. construct app from constituents).
> 
>> **Others**<br>
>> The other files are not needed for now (can be deleted)
>>
>> various config files <br>
>> *Not covered here in detail*

> **Test drive the application** 
>
> - cd into the core-be directory 
> - `npm run start:dev`
>
> If the application has been set up correctly you should now get a "Hello world" when you browse to http://localhost:3001
>
><br>
>
> RECOMMENDED: Postman
>
> We will rarely use the browser to interact with the back end - as the browser can only handle GET requests. Set up Postman and ensure you can make the same request.

> **Cleanup NestJS boilerplat**e
> Remove files we wont use in our project (but were included to allow us to check that our installation was successful):
> 1. src/app.service.ts
> 2. src/app.controller.ts
> 3. src/app.controller.spec.ts
> 4. Remove refernces to the above files in app.module.ts


##### Note: Add a NestJS module: Users (incl. catering to auth)

> **Create a new Module (incl. controller & service)**
>
> From the CLI with pwd: NestJS app folder
> 
> - `nest g module users`
> - `nest g controller users`
> - `nest g service users`

> **Create a new Controller Route: Create a new User**
>
> 1. create a route
>> In `src/users/users.conroller.ts`
>> ```ts
>>  @Post()
>>  createUser() {}
>> ```

> **Implement OBJECT & DATA Validation Targets**
>>
>> Upon receiving a request, the data payload will be extracted (see `@Body()` below). But before we can use it we need to:
>> - Check that the data payload is 'valid'
>> - Handle cases where it is NOT valid
>> 
>> This section deals with defining a validation target. Broadly speaking, validation can be divided into 2 main cagegories:
>> 1. <span style="background-color:red; color:black; font-weight:bold">OBJECT Validation:</span> Checks that the extracted payload object is of the correct 'shape' (i.e. it contains all required keys; the corresponding values are of the correct type)  
>> 2. <span style="background-color:red; color:black; font-weight:bold">DATA Validation:</span> Checks that individual values meet pre-defined criteria (e.g. passwords are long enough and have upper case, lower case, special characters; emails contain the '@' symbol etc.) 
>> <span style="background-color:red; color:black; font-weight:bold">Data Transfer Object (DTO)</span>
>>
>> This section addresses how we define these (Object & Data) validation targets. For this we create a DTO folder/file in the 'users/' folder.
>> 
> 1. Object Validation: Create a DTO
>> As an object validation target we implement a class definition:
>>
>> ```ts
>> export class CreateUserDto {
>>  readonly email: string;
>>  readonly password: string;
>>}
>> ``` 
>> 
>> This defines that the incoming payload must contain an email and a password string.
>>
> 2. Install `class-validator` and `class-transformer`
>> <br>
>>
>> `npm i --save class-validator class-transformer` 
>>
>> <br>
>> For data validation we need a suite of utility classes that define application-specific validity criteria. Rather than implementing this from scratch (re-inventing the wheel) we use a 3rd party library `class-validator`. 
>> 
>> NB: In addition to validation functions it is common practice to also install related tools from the same 3rd party vendor (e.g. the class-transformer (for transforming text-based HTTP requests) and sometimes other (e.g. class-sanitizer) classes)
> 
> 3. Data Validation: edit DTO
>> Now that we have the basic DTO definition and installed the `class-validator` library, we can decorate each DTO datapoint with (data) validity criteria; E.g.
>>
>>> ```ts
>>> export class CreateUserDto {
>>> 
>>> @IsString()
>>> @IsNotEmpty()
>>> @MinLength(2)
>>> @MaxLength(50)
>>> readonly email: string;
>>> 
>>> @IsString()
>>> @IsNotEmpty()
>>> @MinLength(8)
>>> @MaxLength(50)
>>> @IsStrongPassword()
>>> readonly password: string;
>>> }
>>> ``` 
>>
> <span style="color:aquamarine">Taking Stock: <br>*This gives us a validation target for the extracted request payload object - in the next 2 steps we extract this payload object (@Body()) and apply the validation.*</span>
>
> 4. Extract the request body (using the param decorator: @Body())...
> 5. ...and set the "type" to the DTO (to trigger the validation)
>
>> ```ts
>> @Post()
>> createUser(@Body() createUserDto: CreateUserDto) {}
>> ``` 

<span style="color:aquamarine">Taking Stock: <br>*We have now recevied the HTTP request (Controller); Extracted the payload (@Body()); Defined a Validation target (DTO); and implemented the triggering of object and data validation against this target. This concludes the Controller tasks - apart from handing over the incoming request to the Service for processing - i.e. generating the HTTP response payload. This is the **business logic** part of the application.<br>Broadly speaking there can be 2 types or responses to a request: Success or Failure (Error).<br> In the following steps we implement a Service and discuss both Success and Error cases.*</span>

> **Implement the Service method (stub)**
>>
>> Next we implement a (stub) Service method that will be called by the UserController (/users) to (ultimately) create a user "record".  
>>
>> ```ts
>> import { Injectable } from '@nestjs/common';
>> import { CreateUserDto } from './dto/create-user.dto';
>>
>> @Injectable()
>> export class UsersService {
>>  createUser(ctx: CreateUserDto) {
>>    // TODO: Implement createUser() service method
>>    return 'Stub: This action will add a new user';
>>  }
>> }
>> ```
>>
>> The reason for implementing this as a stub is to provide a simplest-case for performing integration (DI) and for testing that the setup responds correctly to Validation Fails (i.e. the Error case).

> **Dependency Inject the Service into the Controller**
> 
>> As a first Integration step, we now provision the Service component to the Controller via DI 
>>
>> ```ts
>> @Controller('users')
>> export class UsersController {
>> 
>>   // Constructor (dependency injection)
>>   constructor(private readonly usersService: UsersService) {}
>> 
>>   // Individual Routes Implementations... 
>> }

> **Trigger Service to handle request: Test Success/Error Cases**
>> 
>>  
>> ```ts
>> @Controller('users')
>> export class UsersController {
>> 
>>   // Constructor (dependency injection)
>>   constructor(private readonly usersService: UsersService) {}
>> 
>>    @Post()
>>    createUser(@Body() req: CreateUserDto) {
>>      return this.usersService.createUser(req);
>>    }
>> }
>> ```

> **Set up Validation "Pipe"**
>> We have now set up the controller (switchboard) by (1) Defining Routes and (2) Injecting the relevant Service(s).<br>
>> We also implemented the Service...<br>
>> ...and set up the DTO validation target by defining a DTO (data-type + data-validation decorators) and setting it as a type for the extracted data payload. 
>> 
>> What we are still needing to do, however, is<span style="background-color:yellow; color:black">to trigger the validation process. Simply setting the DTO as a type does nothing on its own; In fact, TS-types are redacted from the code at Transpilation time (whereas HTTP requests and their playloads wont even exist until run time (i.e. until AFTER transpilation).</span> In order to provide and trigger validation, we therefore need to set up a so-called <span style="background-color:red; color:black">"Pipe".</span>   
>>
>> <br>
>>
>> To set up a Global Validation Pipe (See Appendix for other types of pipes) we:
>> 1. Open

>> In words: <br>
>> In the controller above we inject the appropriate Service to provision it to the controller; and we define a route (switchboard) that will run if the appropriate request is received. This Route:
>> - extracts the request payload from the request (@Body())
>> - triggers validation chekcs (by setting type to CreateUserDTO)
>> - If checks pass: trigger the assigned Service method
>> - If checks fail: return error (HTTP) response 
>> 
>> To test the controller-service integration, as well as success/error response, start up Postman and pass valid and invalid request parameters. The response should be:
>> - Success: 201 Created
>> - Failure: 400 Bad Request 
>>
>> Note 1 to Failure Response:
>>> The response body will contain information that characterizes this failure - e.g.: 
>>> ```
>>> {
>>>  "message": [
>>>    "email must be an email",
>>>    "password is not strong enough"
>>>  ],
>>>  "error": "Bad Request",
>>>  "statusCode": 400
>>>}
>>> ```
>>
>> Note 2 to failure response:
>>> The failure response is generated by the data validation decorators; These can inform you which checks failed - but cannot provide contextual information (i.e. what this failure means for the specific application). Error status codes should be contextual (e.g. an "unauthorized" error has a different status code (401) from a server error 5xx etc.) - while both types of errors can cause the same validation checks to fail! Since the status code is commonly used to select specific error screens/behaviours it is important to set the status code appropriately. <span style="background-color:yellow; color:black">In order to provide an appropriate status code we need to explicitly catch the error and set the status code ourselves.</span>  

---
---
---

## [**Note: Setting up a Configurations Service**]

##### Background & Motivation

Applications can be executed under different run configurations depending on the lifecycle stage (Dev/Test/Prod). These run configurations require different environment variables to be set (dynamically). This can be something as simple as the port on which the server runs; Or it can trigger different processes (e.g. build); Or it can trigger different tools (e.g. test runners); Or it can even implicate NestJS services (e.g. Loggers).  

##### Purpose & Scope
Rather than manually defining/loading/setting config variables, we can use a module implementation to handle setting the configs automatically.

The purpose of implementing the configurations service here is twofold:
1. Configurations: <br>The config module simplifies and streamlines the setting up of different run conigurations. 
2. Practice: <br>It allows us to implement a fullly functioning module that does not depend on a database

The scope of this module is limited to using a readymade module (rather than implementing it from scratch): <span style="background-color:yellow; color:black">NestJS provides a readymade config module we can use.</span> <span style="background-color:red; color:black">However, also note that the NestJS config module works with .env files</span> (i.e. if you want to use e.g. Docker/Github/Hashicorp/etc secrets, this must be edited)






---
---
---

## [*Section*]

##### Background & Motivation

##### Purpose & Scope

##### Note: ...
