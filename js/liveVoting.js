// Define the URL needed to connect to GoInstant.
var goInstantUrl = "https://goinstant.net/BarelyCool/LiveVote";

$(document).ready(function()
{
    // Attempt to connect to the GoInstant server.
    goinstant.connect(goInstantUrl, function (err, platform, lobby)
    {
        // Determine if there was an error connecting to the GoInstant server.
        if (err)
        {
            // Something went wrong connecting to the GoInstant server.  Without
            // the connection the app cannot function, so alert the user by
            // displaying a message and disabling all the input fields on the
            // page.
            throw err;
        }

        var entry = lobby.key("entry");
        var el = $("input[name='entry']");

        entry.on("set", function(value, context)
        {
            el.val(value);
        });

        el.on("keyup", function()
        {
            entry.set($(this).val());
        });
    });
});