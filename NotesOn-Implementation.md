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
> - ✔ The path [...] does not contain a package.json file. Would you like to start a new Next.js project? …                                                       yes
> - ✔ What is your project named? …                              core-ui
> - ? Which style would you like to use:                         New York
> - ? Which color would you like to use as the base color?:      Slate
> - ✔ Would you like to use CSS variables for theming? …         yes

> <small>Alternatively, the STANDARD NextJS CLI command and menu are:
> ```bash
> cd [project root]
> npx create-next-app@latest
> ```
>```
> -> ✔ What is your project named? …                        core_ui
>    ✔ Would you like to use TypeScript? …                  Yes
>    ✔ Would you like to use ESLint? …                      Yes
>    ✔ Would you like to use Tailwind CSS? …                Yes
> -> ✔ Would you like your code inside a `src/` directory?… No
>    ✔ Would you like to use App Router? (recommended) …    Yes
>    ✔ Would you like to use Turbopack for next dev? …      No
>    ✔ Would you like to customize the import alias (@/* by default)? … No
>```
> </small>


## [*Section*]

##### Background & Motivation

##### Purpose & Scope

##### Note: ...