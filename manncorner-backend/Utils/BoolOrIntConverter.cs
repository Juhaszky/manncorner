using System;
using System.Text.Json;
using System.Text.Json.Serialization;

public class BoolOrIntConverter : JsonConverter<bool>
{
    public override bool Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        // Accept 0/1 or true/false
        if (reader.TokenType == JsonTokenType.Number)
            return reader.GetInt32() != 0;
        if (reader.TokenType == JsonTokenType.True) return true;
        if (reader.TokenType == JsonTokenType.False) return false;
        throw new JsonException("Expected bool or int (0/1)");
    }

    public override void Write(Utf8JsonWriter writer, bool value, JsonSerializerOptions options)
        => writer.WriteBooleanValue(value);
}
