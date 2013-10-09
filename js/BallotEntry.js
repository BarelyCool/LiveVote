/**
 * An entry represents a voting option within a ballet.  The entry will keep
 * track of the number of votes it has received and also provides functions for
 * placing and retracting a vote.
 *
 * @param name
 *          The name of the entry.  Can't be undefined.
 * @param id
 *          Unique identifier for the entry.  Can be undefined.
 * @param votes
 *          The number of votes this entry has received.  If undefined the
 *          number of votes will default to 0.
 */
function BallotEntry(name, id, votes)
{
    // Initialize the name, id and votes data members.
    this.name = name;
    this.id = id;
    this.votes = votes;

    // If the number of votes is undefined then automatically set it to 0.
    if (!this.votes)
    {
        this.votes = 0;
    }
}

/**
 * Adds a vote for this entry.  There is no restriction on the number of votes
 * that can be made.
 */
BallotEntry.prototype.addVote = function()
{
    this.votes++;
}

/**
 * Removes a vote from this entry.  Calling this function when the number of
 * votes is 0 will have no effect.
 */
BallotEntry.prototype.removeVote = function()
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
BallotEntry.prototype.toString = function()
{
    return "BallotEntry[id='" + this.id + "' name='" + this.name + "' votes="
        + this.votes + "]";
}