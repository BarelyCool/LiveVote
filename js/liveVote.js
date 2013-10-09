/**
 * Application initialization that is executed when the page loads.
 */
$(document).ready(function()
{
    console.log("Attempting to connect to the GoInstant server.");

    // Create an instance of the ballot.  This will load the ballot and its
    // corresponding entries from the GoInstant server.  Pass a function that
    // will be used to render the ballot on the screen.
    var ballot = new Ballot(ballotRenderer);

    // Set up a handler for when the entry form is submitting.  The handler
    // will invoke the addEntry() function within the Ballot object and supply
    // the entry name that was submitted by the user.
    $("#addEntry").submit(function(event)
    {
        // Get the name of the entry that was submitted by the user.
        var name = $("#name").val();

        // Add the entry to the ballot.
        ballot.addEntry(name);

        // Clear the entry name value in the input field.
        $("#name").val("");

        // Prevent the rest of the form submission from happening so that
        // the browser doesn't reload the page.
        event.preventDefault();
    });
});

/**
 * Renders the supplied ballot on the screen.
 *
 * @param ballot
 *          The ballot to render on the screen or undefined.  Can't be
 *          undefined.
 */
function ballotRenderer(ballot)
{
    // Determine if there are any ballot entries.
    if (ballot.entries)
    {
        console.log("Ballot renderer invoked with entries: " + ballot.entries);

        // Clear the existing entries from the ballot.
        $("#entries").empty();

        // Now loop through each entry and add it as an item to the entries
        // list.
        $.each(ballot.entries, function(index, entry)
        {
            $("#entries").append(
                  "<li>"
                +      entry.name
                + "</li>");
        });
    }
};

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