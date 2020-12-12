describe("User can read a specific article", () => {
	beforeEach(() => {
		cy.server();
		cy.route({
			method: "GET",
			url: "http://localhost:3000/api/articles",
			response: "fixture:articles_data.json",
		});
	});

	context("successfully", () => {
		beforeEach(() => {
			cy.server();
			cy.route({
				method: "GET",
				url: "http://localhost:3000/api/articles/1",
				response: "fixture:single_article.json",
			});
      cy.visit("/");
      cy.get("[data-cy='article-1']").click();
    });
		it("see article content", () => {
			cy.get("[data-cy='article-display']").within(() => {
				cy.get("[data-cy='title']").should(
					"contain",
					"Cats are better than dogs!"
				);
			});
		});
	});
});
