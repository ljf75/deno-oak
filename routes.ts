import { Router, helpers } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import {app} from "./mod.ts";

const router = new Router();


router
	// route to /hello with a basic response
	.get('/hello', (context) => {
		// Just sends a simple response. You could use this to make an API...
		context.response.body = "Hello World!";
		context.response.status = 200;
	})

	// POST route to / with basic response of "Recieved!"
	.post('/', (context) => {
		// sends a response of "Recieved!" with a status of 200
		context.response.body = "Recieved!";
		context.response.status = 200;

		// logs the body of the post request
		console.log(context.request.body);
	})

	// redirect route
	.get('/redirect', (context) => {
		// redirects the user to another website
		context.response.redirect("https://repl.it/@RoBlockHead")
	})

	//route that renders the demo page
	.get('/demo', async (context) => {
		// renders URL parameters and queries
		context.render("demo", {
			demoText: "This text is being shown from the routes.ts file! I can be edited to show other text, even stuff that's specific to the user! Try adding parameters by going to /demo/<param> or add queries by going to /demo?key=value",
			reqParams: "none. try going to /demo/<param>", 
			reqQueries: context.request.url.searchParams
		});
	})
	// route that renders the demo page with parameters
	.get('/demo/:param', (context) => {
		// example of URL parameters in use
		context.render("demo", {
			demoText: "This text is being shown from the routes.ts file! I can be edited to show other text, even stuff that's specific to the user! Try adding parameters by going to /demo/<param> or add queries by going to /demo?key=value",
			reqParams: JSON.stringify(context.params), 
			reqQueries: context.request.url.searchParams
		});
	})

	// route to the login page
	.get('/login', (context) => {
		// renders a login page if the user is not logged in, redirects if logged in
		if(context.cookies.get("logged_in_username") != null) // checks if logged in
			return context.response.redirect("/secret"); // redirect
		context.render("login", {loginText: ""});
	})
	// route to send logins to the server
	.post('/login', async (context) => {
		/** 
		 * WARNING!!!
		 * THIS IS AN EXAMPLE OF REQUESTS!
		 * Please do not use this in an app, as it is very insecure.
		 */
		// Gets the body of the request, specifically, the form sent to the server
		let formData: URLSearchParams = await context.request.body({ type: 'form'}).value;

		// checks to make sure all requests have both fields
		if(!formData.get("username") || !formData.get("password")) 
			return context.render("login", {loginText: "Bad Request!"});

		// if the user's logged in, redirect them to the logged in page.	
		if(context.cookies.get("logged_in_username") != null) 
			return context.response.redirect("/secret");

		// checks the password. this is very insecure and should not be done for anything other than a demo
		if(formData.get("password") != "password123") 
			// re-render the login page with an error.
			return context.render("login", {loginText: "Incorrect Password!"});

		// at this point, the password must be correct, so it loggs the user in.
		context.cookies.set("logged_in_username", formData.get("username"));
		// redirect the new logged in user to the logged in page.
		context.response.redirect("/secret");

	})
	
	// route to log out the user
	.get('/logout', (context) => {
		// logs the user out.
		context.cookies.delete("logged_in_username");
		context.response.redirect("/login");
	})

	// route for logged in users
	.get("/secret", (context) => {
		// page for any user that's logged in
		if(context.cookies.get("logged_in_username") == null)	
			return context.response.redirect("/login");
		context.render("logged_in", {username: context.cookies.get("logged_in_username")});
	});

export default router;