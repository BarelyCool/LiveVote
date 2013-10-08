// Define the URL required to connect to GoInstant.
var goInstantUrl = "https://goinstant.net/BarelyCool/LiveVote";

/**
 * Application initialization that is executed when the page loads.
 */
$(document).ready(function()
{
    console.log("Attempting to connect to the GoInstant server.");

    // Attempt to connect to the GoInstant server.
    goinstant.connect(goInstantUrl, function (error, platform, room)
    {
        // Determine if there was an error connecting to the GoInstant server.
        if (error)
        {
            // Something went wrong connecting to the GoInstant server.  Without
            // the connection the app cannot function, so take appropriate
            // action.
            handleError(
                error,
                "Unable to connect to GoInstant.  Application is disabled.");
        }

        // The connection with GoInstant was succesful, so now we can proceed
        // with initializing and configuring the application.
        console.log("Successfully connected to the GoInstant server.");

        // Get the ballot key from the current room.
        var ballot = room.key("/ballot");

        // Set up a handler for when the entry form is submitting.  The handler
        // will invoke the addEntry() function with the ballot object as well as
        // the entry value that was submitted by the user.
        $("#addEntry").submit(function(event)
        {
            // Get the value of the entry that was submitted by the user.
            var entry = $("#entry").val();

            // Add the entry to the current ballot.
            addEntry(entry, ballot);

            // Prevent the rest of the form submission from happening so that
            // the browser doesn't reload the page.
            event.preventDefault();
        });

        // Create a listener that will be triggered when any user, local or
        // remote, performs any action on the ballot (such as add/remove entry).
        var ballotListener = function(value, context)
        {
            console.log("Ballot listener invoked...");

            // TODO Fill out the listener...
        };

        // Set up a watch on the ballot key and supply a listener that will
        // respond to entries being added or removed from the ballot.
        ballot.watch(ballotListener, function(error)
        {
            console.log("Attempting to setup ballot watch.");

            // Determine if there was an error setting up the ballot watch.
            if (error)
            {
                // An error occurred setting up the ballot watch.  Without the
                // watch the application is effectively useless, so log the
                // error and disable the application.
                handleError(error, "Unable to setup ballot watch.");
            }

            console.log("Successfully setup ballot watch.");
        });
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
    console.log("Attempting to add entry='" + entry + "' to ballot.");

    // TODO Fill out the rest of this function...
}

/**
 * Invoked when an error occurs initializing the application.  The error will be
 * logged along with a user-friendly description that will be shown to the user.
 * All input fields on the page will be disabled since the application can't
 * function with errors.
 *
 * @param err
 *          The application error that was encountered.  Can't be undefined.
 * @param desc
 *          A user-friendly description of the error that was encountered.  This
 *          description will be logged to the console for debugging purposes and
 *          will also be displayed to the user.  Can't be an empty string.
 */
function handleError(err, desc)
{
    // Log the user-friendly description of the error to the console for
    // debugging purposes.
    console.log(desc);

    // Disable the application by disabling all of the input fields on the page.
    // This will prevent the user from doing anything.
    $("input").prop("disabled", true);

    // Let the user know that a problem occurred and that the application is now
    // disabled.
    //
    // TODO An alert is okay for now, but since they're generally annoying it
    // would be nice to present this message a different way.
    //
    alert(desc);

    // For good measure throw the error.
    throw err;
}