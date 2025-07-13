using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace manncorner_backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSchemaPrimaryKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tf2ItemSchemas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Defindex = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ItemClass = table.Column<string>(type: "text", nullable: true),
                    ItemTypeName = table.Column<string>(type: "text", nullable: true),
                    ItemName = table.Column<string>(type: "text", nullable: true),
                    ItemDescription = table.Column<string>(type: "text", nullable: true),
                    ProperName = table.Column<bool>(type: "boolean", nullable: false),
                    ItemSlot = table.Column<string>(type: "text", nullable: true),
                    ModelPlayer = table.Column<string>(type: "text", nullable: true),
                    ItemQuality = table.Column<int>(type: "integer", nullable: false),
                    ImageInventory = table.Column<string>(type: "text", nullable: true),
                    MinILevel = table.Column<int>(type: "integer", nullable: true),
                    MaxILevel = table.Column<int>(type: "integer", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    ImageUrlLarge = table.Column<string>(type: "text", nullable: true),
                    DropType = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tf2ItemSchemas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SteamId = table.Column<string>(type: "text", nullable: false),
                    TradeUrl = table.Column<string>(type: "text", nullable: true),
                    XP = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tf2ItemAttribute",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Tf2ItemSchemaId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Class = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tf2ItemAttribute", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tf2ItemAttribute_Tf2ItemSchemas_Tf2ItemSchemaId",
                        column: x => x.Tf2ItemSchemaId,
                        principalTable: "Tf2ItemSchemas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tf2ItemStyle",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Tf2ItemSchemaId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tf2ItemStyle", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tf2ItemStyle_Tf2ItemSchemas_Tf2ItemSchemaId",
                        column: x => x.Tf2ItemSchemaId,
                        principalTable: "Tf2ItemSchemas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tf2ItemAttribute_Tf2ItemSchemaId",
                table: "Tf2ItemAttribute",
                column: "Tf2ItemSchemaId");

            migrationBuilder.CreateIndex(
                name: "IX_Tf2ItemSchemas_Defindex",
                table: "Tf2ItemSchemas",
                column: "Defindex");

            migrationBuilder.CreateIndex(
                name: "IX_Tf2ItemStyle_Tf2ItemSchemaId",
                table: "Tf2ItemStyle",
                column: "Tf2ItemSchemaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tf2ItemAttribute");

            migrationBuilder.DropTable(
                name: "Tf2ItemStyle");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Tf2ItemSchemas");
        }
    }
}
