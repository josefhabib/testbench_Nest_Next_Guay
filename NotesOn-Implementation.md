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
> Once our routes are available we can add components to them. ShadCN has "blocks" which are pre-built higher-order widgets like login screens that we can use right out of the box.

> **Apply Theme**
>

##### Note: 

## [*Section*]

##### Background & Motivation

##### Purpose & Scope

##### Note: ...