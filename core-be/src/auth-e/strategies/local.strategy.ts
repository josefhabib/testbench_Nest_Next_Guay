import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local"; // NB: Here we import the Strategy class from passport-local (later we will import from passport-jwt)

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(username: string, password: string): Promise<boolean> {
    return false;
  }
}

// NOTE
// ----
//
// - A detail of this setup that may appear strange is that we extend a class 
//   from a function:
//  
//   > export class LocalStrategy extends PassportStrategy(Strategy)
//
//   PassportStrategy is a "higher order" "function": 
//     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//     it is a class factory - i.e. a function that returns a class. 
//     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
//   Why do we need this?
//    Different authentication stragegies have fundamentally different configurations.
//    For instance, a local strategy requires a username and password, whereas 
//    an OAuth strategy requires a client ID and client secret.
//
//   On the other hand, all authentication strategies share some common functionality:
//    - They all require a validate() method.
//    - They all require a constructor that accepts configuration options.
//    - They all return a user object if the credentials are valid.
//
// By using a class factory, we can define the common functionality in the 
//  PassportStrategy class without imposing a specific configuration.
//
// The specific strategy we use is governed by which "Strategy" we imported.
// Here we:
//    >  import { Strategy } from "passport-local"
//
// However, since we also installed passport-jwt, we could also import the
//  JWT strategy from there:
//    >  import { Strategy } from "passport-jwt"
