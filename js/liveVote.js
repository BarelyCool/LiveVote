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
                "Failed to connect to GoInstant.  Application is disabled.");
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
        var ballotListener = function(entries, context)
        {
            // Determine if there are any ballot entries.
            if (entries)
            {
                console.log("Ballot listener invoked with entries: " + entries);

                // For now set entries as the text of the ballot element.
                //
                // TODO Eventually do something more fancy here.
                //
                $("#ballot").text(entries);
            }
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
                handleError(error, "Failed to setup ballot watch.");
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
    console.log("Attempting to add entry '" + entry + "' to ballot.");

    // Get the value of the ballet key, which represents the entries of the
    // ballot.
    ballot.get(function(error, entries, context)
    {
        // Check if there was an error retrieving the ballot entries.
        if (error)
        {
            // A error occurred getting the ballot entries.  Without the entries
            // the application is effectively useless, so log the error and
            // disable the application.
            handleError(error, "Failed to get ballot entries.");
        }

        // Check if the entries value is null.  If so, it means that no entries
        // have been added to the ballot yet.
        if (entries)
        {
            console.log("Ballot already has entries; adding new entry to "
                + "existing array.");

            // The ballot already has entries so add the new entry to the
            // collection.
            entries.push(entry);
        }
        else
        {
            console.log("Ballot does not have any entries; creating new array "
                + "of entries.");

            // The ballot does not have any entries, so create a new array and
            // add the new entry.
            entries = [entry];
        }

        // Set the updated array of entries within the ballot.
        ballot.set(entries, function(error)
        {
            // Check if there was an error setting the entries within the
            // ballot.
            if (error)
            {
                // There was an error setting the entries within the ballot.
                // Without the ability to save entries the application cannot
                // function, so log the error and disable the application.
                handleError(error, "Failed to set entries within the ballot.");
            }

            console.log("Successfully added entry '" + entry + "' to ballot.");
        });
    });
}

/**
 * Invoked when an error occurs initializing the application.  The error will be
 * logged along with a user-friendly description that will be shown to the user.
 * All input fields on the page will be disabled since the application can't
 * function with errors.
 *
 * @param error
 *          The application error that was encountered.  Can't be undefined.
 * @param description
 *          A user-friendly description of the error that was encountered.  This
 *          description will be logged to the console for debugging purposes and
 *          will also be displayed to the user.  Can't be an empty string.
 */
function handleError(error, description)
{
    // Log the user-friendly description of the error to the console for
    // debugging purposes.
    console.log(description);

    // Disable the application by disabling all of the input fields on the page.
    // This will prevent the user from doing anything.
    $("input").prop("disabled", true);

    // Let the user know that a problem occurred and that the application is now
    // disabled.
    //
    // TODO An alert is okay for now, but since they're generally annoying it
    // would be nice to display this message a different way.
    //
    alert(description);

    // For good measure throw the error.
    throw error;
}