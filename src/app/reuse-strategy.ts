/**
 * reuse-strategy.ts
 * by corbfon 1/6/17
 */

import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';

/** Interface for object which can store both: 
 * An ActivatedRouteSnapshot, which is useful for determining whether or not you should attach a route (see this.shouldAttach)
 * A DetachedRouteHandle, which is offered up by this.retrieve, in the case that you do want to attach the stored route
 */
interface RouteStorageObject {
    snapshot: ActivatedRouteSnapshot;
    handle: DetachedRouteHandle;
}

export class CustomReuseStrategy implements RouteReuseStrategy {
 
  routesToCache: string[] = ["search/:id"];
 // routesToCache: string[] = ["aj/"];

 storedRouteHandles = new Map<string, DetachedRouteHandle>();

 // Decides if the route should be stored
 shouldDetach(route: ActivatedRouteSnapshot): boolean {
  //    console.log(route); 
 
   return this.routesToCache.indexOf(route.routeConfig.path) > -1;
 }

 //Store the information for the route we're destructing
 store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    // console.log(route); 
   this.storedRouteHandles.set(route.routeConfig.path, handle);
 }

//Return true if we have a stored route object for the next route
 shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.storedRouteHandles.has(route.routeConfig.path);
 }

 //If we returned true in shouldAttach(), now return the actual route data for restoration
 retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    //  console.log(route); 
 
   return this.storedRouteHandles.get(route.routeConfig.path);
 }

 //Reuse the route if we're going to and from the same route
 shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
 }
}