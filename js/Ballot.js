/**
 * A ballot contains 0 or many Entry object that form the heart of the live
 * voting system.  Users can add new entries to the ballot, place an unlimited
 * amount of votes and also remove entries from the ballot.
 *
 * Once instantiated the ballot will load all existing entries from the
 * GoInstant system.  Only one instance should exist per page.
 */
function Ballot()
{
    // Define the URL required to connect to GoInstant.
    var goInstantUrl = "https://goinstant.net/BarelyCool/LiveVote";

    // Keep a local reference to this class so that it can be used within the
    // callback function below.  Without this reference there will be no way to
    // access class's data members inside the callback.
    var self = this;

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
        self.ballot = room.key("/ballot");

        // Create a listener that will be triggered when any user, local or
        // remote, performs any action on the ballot (such as add/remove entry).
        var ballotListener = function(entries, context)
        {
            // Determine if there are any ballot entries.
            if (entries)
            {
                console.log("Ballot listener invoked with entries: " + entries);

                // Clear the existing entries from the ballot.
                $("#entries").empty();

                // Now loop through each entry and add it as an item to the
                // entries list.
                $.each(entries, function(index, entry)
                {
                    $("#entries").append("<li>" + entry + "</li>");
                });
            }
        };

        // Set up a watch on the ballot key and supply a listener that will
        // respond to entries being added or removed from the ballot.
        self.ballot.watch(ballotListener, function(error)
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
}

/**
 * Adds the supplied entry value to the ballot.
 *
 * @param entry
 *          The entry that will be added to the ballot.  If the entry is an
 *          empty string it will be ignored.
 */
Ballot.prototype.addEntry = function(entry)
{
    console.log("Attempting to add entry '" + entry + "' to ballot.");

    // Keep a local reference to this class so that it can be used within the
    // callback function below.  Without this reference there will be no way to
    // access class's data members inside the callback.
    var self = this;

    // Get the value of the ballet key, which represents the entries of the
    // ballot.
    self.ballot.get(function(error, entries, context)
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
        self.ballot.set(entries, function(error)
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
};