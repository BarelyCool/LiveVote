/**
 * An entry represents a voting option within a ballet.  The entry will keep
 * track of the number of votes it has received and also provides functions for
 * placing and retracting a vote.
 *
 * @param id
 *          Unique identifier for the entry.  Can't be undefined.
 * @param name
 *          The name of the entry.  Can't be undefined.
 * @param votes
 *          The number of votes this entry has received.  Can't be undefined.
 */
function Entry(id, name, votes)
{
    // Initialize the id, name and vote data members.
    this.id = id;
    this.name = name;
    this.votes = votes;
}

/**
 * Adds a vote for this entry.  There is no restriction on the number of votes
 * that can be made.
 */
Entry.prototype.addVote = function()
{
    this.votes++;
}

/**
 * Removes a vote from this entry.  Calling this function when the number of
 * votes is 0 will have no effect.
 */
Entry.prototype.removeVote = function()
{
    // Only remove a vote if the number of votes is more than 0.
    if (this.votes > 0)
    {
        this.votes--;
    }
}

/**
 * @return A string representation of a ballot entry.
 */
Entry.prototype.toString = function()
{
    return "Entry[id='" + this.id + "' name='" + this.name + "']";
}