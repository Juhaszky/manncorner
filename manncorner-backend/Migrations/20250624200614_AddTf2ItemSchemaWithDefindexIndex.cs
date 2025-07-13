using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace manncorner_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTf2ItemSchemaWithDefindexIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tf2ItemAttribute_Tf2ItemSchemas_Tf2ItemSchemaId",
                table: "Tf2ItemAttribute");

            migrationBuilder.DropForeignKey(
                name: "FK_Tf2ItemStyle_Tf2ItemSchemas_Tf2ItemSchemaId",
                table: "Tf2ItemStyle");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tf2ItemSchemas",
                table: "Tf2ItemSchemas");

            migrationBuilder.DropIndex(
                name: "IX_Tf2ItemSchemas_Defindex",
                table: "Tf2ItemSchemas");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Tf2ItemSchemas");

            migrationBuilder.AlterColumn<int>(
                name: "Defindex",
                table: "Tf2ItemSchemas",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tf2ItemSchemas",
                table: "Tf2ItemSchemas",
                column: "Defindex");

            migrationBuilder.AddForeignKey(
                name: "FK_Tf2ItemAttribute_Tf2ItemSchemas_Tf2ItemSchemaId",
                table: "Tf2ItemAttribute",
                column: "Tf2ItemSchemaId",
                principalTable: "Tf2ItemSchemas",
                principalColumn: "Defindex",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tf2ItemStyle_Tf2ItemSchemas_Tf2ItemSchemaId",
                table: "Tf2ItemStyle",
                column: "Tf2ItemSchemaId",
                principalTable: "Tf2ItemSchemas",
                principalColumn: "Defindex",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tf2ItemAttribute_Tf2ItemSchemas_Tf2ItemSchemaId",
                table: "Tf2ItemAttribute");

            migrationBuilder.DropForeignKey(
                name: "FK_Tf2ItemStyle_Tf2ItemSchemas_Tf2ItemSchemaId",
                table: "Tf2ItemStyle");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tf2ItemSchemas",
                table: "Tf2ItemSchemas");

            migrationBuilder.AlterColumn<int>(
                name: "Defindex",
                table: "Tf2ItemSchemas",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Tf2ItemSchemas",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tf2ItemSchemas",
                table: "Tf2ItemSchemas",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Tf2ItemSchemas_Defindex",
                table: "Tf2ItemSchemas",
                column: "Defindex");

            migrationBuilder.AddForeignKey(
                name: "FK_Tf2ItemAttribute_Tf2ItemSchemas_Tf2ItemSchemaId",
                table: "Tf2ItemAttribute",
                column: "Tf2ItemSchemaId",
                principalTable: "Tf2ItemSchemas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tf2ItemStyle_Tf2ItemSchemas_Tf2ItemSchemaId",
                table: "Tf2ItemStyle",
                column: "Tf2ItemSchemaId",
                principalTable: "Tf2ItemSchemas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
