// Define the URL required to connect to GoInstant.
var goInstantUrl = "https://goinstant.net/BarelyCool/LiveVote";

/**
 * Application initialization that is executed when the page loads.
 */
$(document).ready(function()
{
    console.log("Attempting to connect to the GoInstant server.");

    // Attempt to connect to the GoInstant server.
    goinstant.connect(goInstantUrl, function (err, platform, room)
    {
        // Determine if there was an error connecting to the GoInstant server.
        if (err)
        {
            // Something went wrong connecting to the GoInstant server.  Without
            // the connection the app cannot function, so take appropriate
            // action.
            console.log("Error connecting to GoInstant server: " + err);

            // Disable the application by disabling all of the input fields on
            // the page.  This will prevent the user from doing anything.
            $("input").prop("disabled", true);

            // Let the user know that a problem occurred and that the
            // application is now disabled.
            //
            // TODO An alert is okay for now, but since they're generally
            // annoying it would be nice to present this message a different
            // way.
            //
            alert("Unable to connect to GoInstant server.  Application is "
                + "disabled.");

            // For good measure throw the error.
            throw err;
        }

        // The connection with GoInstant was succesful, so now we can proceed
        // with initializing and configuring the application.
        console.log("Successfully connected to the GoInstant server.");

        // TODO Fill out the rest of the logic...
    });
});

/**
 *  Adds the supplied entry value to the ballot.
 *
 * @param entry
 *          The entry that will be added to the ballot.  If the entry is an
 *          empty string it will be ignored.
 * @param ballot
 *          The ballot where the supplied entry will be added.  This cannot be
 *          undefined.
 */
function addEntry(entry, ballot)
{
    console.log("Attempting to add entry='" + entry + "' to ballet");

    // TODO Fill out the rest of this function...
}