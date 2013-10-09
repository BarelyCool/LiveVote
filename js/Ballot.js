/**
 * A ballot contains 0 or many Entry objects that form the heart of the live
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

    // Instantiate an array data member that is used to hold the ballot entries.
    this.entries = [];

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

        console.log("Attempting to load ballot entries.");

        // Get the value of the ballet key, which returns a map of the entry
        // identifiers to names.  Note that each id was generated by GoInstant.
        self.ballot.get(function(error, entries, context)
        {
            // Check if there was an error retrieving the ballot entries.
            if (error)
            {
                // A error occurred getting the ballot entries.  Without the
                // entries the application is effectively useless, so log the
                // error and disable the application.
                handleError(error, "Failed to load ballot entries.");
            }

            // Proceed only if the entries value that was provided is not
            // undefined.
            if (entries)
            {
                // Get the entry identifiers, which were automatically generated
                // by GoInstant.
                var identifiers = Object.keys(entries);

                // For each id get the corresponding entry name.
                for (var i = 0; i < identifiers.length; ++i)
                {
                    // Get the current entry id and name.
                    var id = identifiers[i];
                    var name = entries[id];
                    
                    // Create a new Entry object using the id and name values.
                    // Prefix the entry id with "/ballot" so that it holds the
                    // fully qualified id.  Add the entry to the local array of
                    // entries specific to the ballot class.
                    self.entries.push(new Entry("/ballot/" + id, name));
                }

                console.log("Successfully loaded ballot entries: "
                    + self.entries);

                // The ballot entries were successfully loaded, so render the
                // entries on the page.
                render(self.entries);
            }
            else
            {
                // The entries value that was provided was undefined, which
                // means there aren't any entries yet.
                console.log("There are no ballot entries yet.");
            }
        });
        
        // Define a function responsible for reacting to new entries being added
        // both by the local user and remote users.
        function addEntryListener(name, context)
        {
            // Add the entry to the local data member.
            self.entries.push(new Entry(context.addedKey, name));

            // The entries have been updated, so re-render them on the page.
            render(self.entries);
        }

        // Register the add entry listener.  This will fire any time anyone adds
        // an entry (both local user and remote users).
        self.ballot.on(
            "add",
            {local:true, bubble:true, listener:addEntryListener});

        // Define a function responsible for reacting to entries being removed
        // both by the local user and remote users.
        function removeEntryListener(entry)
        {
            // Remove the entry from the local data member.
            //self.entries.push(entry);

            // The entries have been updated, so re-render them on the page.
            render(self.entries);
        }

        // Register the remove entry listener.  This will fire any time anyone
        // removes an entry (both local user and remote users).
        self.ballot.on(
            "remove",
            {local:true, bubble:true, listener:removeEntryListener});
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

    // Add the new entry to the ballot and listen for any errors.
    this.ballot.add(entry, function(error)
    {
        // Check if there was an error adding the entry to the ballot.
        if (error)
        {
            // There was an error adding the entry to the ballot.  Without the
            // ability to add entries the application cannot function, so log
            // the error and disable the application.
            handleError(error, "Failed to add entry '" + entry + "' to the "
                + "ballot.");
        }

        console.log("Successfully added entry '" + entry + "' to ballot.");
    });
};

/**
 * Removes the entry with the supplied id from the ballot.
 *
 * @param entryId
 *          The id of the entry that will be removed from the ballot.  Can't be
 *          undefined.
 */
Ballot.prototype.removeEntry = function(entryId)
{
    console.log("Attempting to remove entry with id '" + entryId + "' from the "
        + "ballot.");

    // Removes the entry from the ballot and listen for any errors.
    this.ballot.remove("/ballot/" + entryId, function(error)
    {
        // Check if there was an error removing the entry from the ballot.
        if (error)
        {
            // There was an error removing the entry from the ballot.  Without
            // the ability to remove entries the application cannot function, so
            // log the error and disable the application.
            handleError(error, "Failed to remove entry with id '" + entryId
                + "' from the ballot.");
        }

        console.log("Successfully removed entry with id '" + entryId + "' from "
            + "the ballot.");
    });
};

/**
 * Renders the supplied ballot entries on the screen.
 *
 * @param entries
 *          The ballot entries to render on the screen or undefined if there are
 *          no entries to render.
 */
function render(entries)
{
    // Determine if there are any ballot entries.
    if (entries)
    {
        console.log("Ballot renderer invoked with entries: " + entries);

        // Clear the existing entries from the ballot.
        $("#entries").empty();

        // Now loop through each entry and add it as an item to the entries
        // list.
        $.each(entries, function(index, entry)
        {
            $("#entries").append(
                  "<li>"
                +      entry.name
                + "</li>");
        });
    }
};