using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class StrangeItemStatHistory
{
    [Key]
    public int Id { get; set; }
    public string UserId { get; set; }
    public string ItemId { get; set; }
    public int Counter { get; set; }
    [NotMapped]
    public List<CounterEntry> Counters { get; set; } = new List<CounterEntry>();

    public DateTime ChangeDate { get; set; } = DateTime.UtcNow;
}
public class CounterEntry
{
    public DateTime ChangeDate { get; set; }
    public int Value { get; set; }
}