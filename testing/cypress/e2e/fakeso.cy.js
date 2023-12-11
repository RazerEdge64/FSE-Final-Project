describe('Fake SO Test Suite', () => {
    beforeEach(() => {
        // for exec pass in path C:\Users\Steff\cs5500-final-project-shubhang-steffi\server\init.js\mongodb://127.0.0.1:27017/fake_so

        // cy.exec('cd ..');
        cy.exec('node ../server/init.js mongodb://127.0.0.1:27017/fake_so');
        cy.visit('http://localhost:3000');
    });

    afterEach(() => {
        // cy.exec('cd ..');
        cy.exec('node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so');
    });


    describe('Account Creation Tests', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
        });

        it('Successfully registers a new user', () => {
            cy.visit('http://localhost:3000');
            cy.get('.action-button-register').click();

            // Fill in the registration form
            cy.get('input[type="text"]').type('test1');
            cy.get('input[type="email"]').type('test1@google.com');
            cy.get('input[type="password"]').first().type('123456');
            cy.get('input[type="password"]').last().type('123456');
            cy.get('.blue-button').click();

        });
        // from here
        it('Validates password length during account creation', () => {
            cy.visit('http://localhost:3000');
            cy.get('.action-button-register').click();

            cy.get('#usernameInput').type('newuser');
            cy.get('#emailInput').type('newuser@example.com');
            cy.get('#passwordInput').type('123');
            cy.get('#confirmPasswordInput').type('123');
            cy.get('#registerButton').click();
            cy.contains('Password must be at least 6 characters');
        });

        it('Validates required username during account creation', () => {
            cy.visit('http://localhost:3000');
            cy.get('.action-button-register').click();

            // Leave the username empty
            cy.get('#emailInput').type('newuser@example.com');
            cy.get('#passwordInput').type('123456');
            cy.get('#confirmPasswordInput').type('123456');
            cy.get('#registerButton').click();
            cy.contains('Username is required');
        });

        it('Validates required email during account creation', () => {
            cy.visit('http://localhost:3000');
            cy.get('.action-button-register').click();

            cy.get('#usernameInput').type('newuser');
            // Leave the email empty
            cy.get('#passwordInput').type('123456');
            cy.get('#confirmPasswordInput').type('123456');
            cy.get('#registerButton').click();
            cy.contains('Email is required');
        });

        it('Validates required password during account creation', () => {
            cy.visit('http://localhost:3000');
            cy.get('.action-button-register').click();

            cy.get('#usernameInput').type('newuser');
            cy.get('#emailInput').type('newuser@example.com');
            // Leave the password empty
            cy.get('#confirmPasswordInput').type('123456');
            cy.get('#registerButton').click();
            cy.contains('Password is required');
        });

        it('Validates password and confirm password match during account creation', () => {
            cy.visit('http://localhost:3000');
            cy.get('.action-button-register').click();

            cy.get('#usernameInput').type('newuser');
            cy.get('#emailInput').type('newuser@example.com');
            cy.get('#passwordInput').type('123456');
            cy.get('#confirmPasswordInput').type('654321');
            cy.get('#registerButton').click();
            cy.contains('Passwords do not match');
        });

        // To here

        it('Shows error for account creation with existing email', () => {
            cy.get('.action-button-register').click();
            cy.get('#usernameInput').type('user10');
            cy.get('#emailInput').type('user1@example.com');
            cy.get('#passwordInput').type('123456');
            cy.get('#confirmPasswordInput').type('123456');
            cy.get('#registerButton').click();
            cy.contains('Email already in use');
        });

        it('Shows error for account creation with existing username', () => {
            cy.get('.action-button-register').click();
            cy.get('#usernameInput').type('user1');
            cy.get('#emailInput').type('user1@example.com');
            cy.get('#passwordInput').type('123456');
            cy.get('#confirmPasswordInput').type('123456');
            cy.get('#registerButton').click();
            cy.contains('Username already in use');
        });

        it('Validates password does not contain username or email', () => {
            cy.visit('http://localhost:3000');
            cy.get('.action-button-register').click();

            cy.get('#usernameInput').type('uniqueuser');
            cy.get('#emailInput').type('uniqueuser@example.com');
            cy.get('#passwordInput').type('uniqueuser');
            cy.get('#confirmPasswordInput').type('uniqueuser');
            cy.get('#registerButton').click();
            cy.contains('Password should not contain username or email');
        });

        it('Redirects to login page after successful registration', () => {

            cy.contains('Login');
        });

    });

    describe('Login Tests', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser()
        });

        it('Successfully Logged in', () => {
            cy.contains('user1');
        });

    });

    describe('Logout Tests', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser()
        });

        it('Successfully Logged out', () => {
            cy.get("#logoutButton").click();
            cy.contains('Login');
        });

    });

    describe('Guest Login', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginGuest()
        });

        it('Successfully Logged in as a Guest', () => {
            cy.contains('Guest');
        });
    });

    describe('User Profile', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser()
        });

        it('View User Profile', () => {
            cy.get('#userDisplay').click();
            cy.contains("Days as a Member");
        });

        it('Displays User Information', () => {
            cy.get('#userDisplay').click();
            cy.contains('Days as a Member');
            cy.contains('User Reputation');
        });

        it('Displays Questions Posted by the User & pagination', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-questions-button').click();
            cy.get('.user-question').should('have.length', 5);
            cy.get('.deleteQuestionButton').should('exist');
            cy.get('#nextQuestionsPagination').click();
            cy.get('#prevQuestionsPagination').click();
        });

        it('Displays Tags Created by the User', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-tags-button').click();
            cy.get('.tagNode').should('exist');

            cy.get('.deleteTagButton').should('exist');
            cy.get('.editTagButton').should('exist');
        });

        it('Displays Answers Created by the User & pagination', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-answers-button').click();
            cy.get('.user-answer').should('exist');

            cy.get('.deleteAnswerButton').should('exist');
            cy.get('#nextAnswersPagination').click();
            cy.get('#prevAnswersPagination').click();
        });
        // --------

        it('Allows Editing of a Question', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-questions-button').click();
            cy.get('.user-question-title').first().click();

            cy.get('#formTitleInput').should('have.value', 'Question Title 1');
            cy.get('#formTextInput').should('have.value', 'Question Text 1');

            cy.get('#formTitleInput').type(' Edited');
            cy.get('.blue-button').click();

            cy.contains('All Questions');
        });


        it('Allows Editing of an Answer', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-answers-button').click();
            cy.get('.user-answer-link a').first().click();

            cy.get('#answerTextInput').should('have.value', 'Answer Text 1 for Q1');

            cy.get('#answerTextInput').clear().type('Updated Answer Text');
            cy.get('.blue-button').click();

            cy.contains('Upvote');
        });

        it('Allows Editing of a Tag', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-tags-button').click();

            cy.get('.tagNode').first().find('.editTagButton').click();

            cy.get('.tagNode').first().find('input').should('exist').clear().type('Updated Tag Name');

            cy.get('.tagNode').first().find('.updateTagButton').click();

            cy.get('.tagNode').first().should('contain', 'Updated Tag Name');
        });

        it('Validates Tag Edit and Update', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-tags-button').click();

            cy.get('.tagNode').first().find('.editTagButton').click();

            cy.get('.tagNode').first().find('input').should('exist').clear().type('Updated Tag Name');

            cy.get('.tagNode').first().find('.updateTagButton').click();


            cy.get('.tagNode').first().should('contain', 'Updated Tag Name');

        });

        it('Validates Empty Tag Edit and Update', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-tags-button').click();

            cy.get('.tagNode').first().find('.editTagButton').click();

            cy.get('.tagNode').first().find('input').should('exist').clear().type('Updated Tag Name');

            cy.get('.tagNode').first().find('.updateTagButton').click();

            cy.contains('Update');

        });

        it('Allows Deletion of a Tag', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-tags-button').click();

            cy.get('.tagNode').first().invoke('text').as('firstTagName');

            cy.get('.tagNode').first().find('.deleteTagButton').click();

            cy.get('.tagNode').should('not.contain', "tag1user1");
        });

        it('Allows Deletion of a Question', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-questions-button').click();

            cy.get('.user-question').first().invoke('text').as('firstQuestionTitle');

            cy.get('.user-question').first().find('.deleteQuestionButton').click();

            cy.get('.user-questions-container').should('not.contain', "Question Title 1");

        });

        it('Allows Deletion of an Answer', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-answers-button').click();
            cy.get('.user-answer').first().invoke('text').as('firstAnswerText');
            cy.get('.user-answer').first().find('.deleteAnswerButton').click();
            cy.get('.user-answers-container').should('not.contain', "Answer Text 1 for Q1");

        });

        it('Check Reputation Increase', () => {
            cy.contains('Question Title 1').click();
            cy.get('.upvote-button-question').click();
            cy.get('#userDisplay').click();

            cy.contains("User Reputation: 105");
        });

        it('Check Reputation Decrease', () => {
            cy.contains('Question Title 1').click();
            cy.get('.downvote-button-question').click();
            cy.get('#userDisplay').click();

            cy.contains("User Reputation: 90");
        });

    });

    describe('New Question', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser()
        });
        it('new question post user', () => {
            cy.contains('Ask a Question').click();
            cy.get('#formTitleInput').type('Test Question 1');
            cy.get('#formTextInput').type('Test Question 1 input');
            cy.get('#formTagInput').type('tag1');
            cy.get('#formUsernameInput');
            cy.contains('Post Question').click();
            cy.contains('Test Question 1').should('be.visible');
        })
        it('should show error when title is empty', () => {
            cy.contains('Ask a Question').click();
            cy.get('#formTextInput').type('Test Question Text');
            cy.get('#formTagInput').type('tag1');
            cy.contains('Post Question').click();
            cy.get('.error-message').contains('Title cannot be empty').should('be.visible');
        });

        it('should show error when question text is empty', () => {
            cy.contains('Ask a Question').click();
            cy.get('#formTitleInput').type('Test Question Title');
            cy.get('#formTagInput').type('tag1');
            cy.contains('Post Question').click();
            cy.get('.error-message').contains('Question text cannot be empty').should('be.visible');
        });

        it('should show error when more than five tags are entered', () => {
            cy.contains('Ask a Question').click();
            cy.get('#formTitleInput').type('Test Question Title');
            cy.get('#formTextInput').type('Test Question Text');
            cy.get('#formTagInput').type('tag1 tag2 tag3 tag4 tag5 tag6');
            cy.contains('Post Question').click();
            cy.get('.error-message').contains('Cannot have more than 5 tags').should('be.visible');
        });

        it('should show error for invalid hyperlink in question text', () => {
            cy.contains('Ask a Question').click();
            cy.get('#formTitleInput').type('Test Question Title');
            cy.get('#formTextInput').type('This is an [invalid link](http)');
            cy.get('#formTagInput').type('tag1');
            cy.contains('Post Question').click();
            cy.get('.error-message').contains('Invalid hyperlink').should('be.visible');
        });

        it('should show error for title longer than 100 characters', () => {
            cy.contains('Ask a Question').click();
            cy.get('#formTitleInput').type('a'.repeat(101));
            cy.get('#formTextInput').type('Valid Question Text');
            cy.get('#formTagInput').type('tag1');
            cy.contains('Post Question').click();
            cy.get('.error-message').contains('Title cannot be more than 100 characters').should('be.visible');
        });

        it('should show error for tag longer than 20 characters', () => {
            cy.contains('Ask a Question').click();
            cy.get('#formTitleInput').type('Valid Title');
            cy.get('#formTextInput').type('Valid Question Text');
            cy.get('#formTagInput').type('a'.repeat(21));
            cy.contains('Post Question').click();
            cy.get('.error-message').contains('Tag length cannot be more than 20').should('be.visible');
        });
    });

    describe('AnswersPage Component Tests', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser()
            cy.contains('Question Title 1').click();
        });

        it('should show error when answer text is empty', () => {

            cy.contains('Answer Question').click();
            cy.get('#answerTextInput');
            cy.contains('Post Answer').click();
            cy.get('.error-message').contains('Answer text cannot be empty').should('be.visible');
        });

        it('should show error for invalid hyperlink in answer text', () => {
            cy.contains('Answer Question').click();
            cy.get('#answerTextInput').type('[invalid link](http)');
            cy.contains('Post Answer').click();
            cy.get('.error-message').contains('Invalid hyperlink').should('be.visible');
        });

        it('Checks if the correct number of votes is displayed for an answer', () => {
            cy.get('.answerVotes').first().should('contain', '2 votes');
        });

        it('Add answer', () => {
            cy.contains('Answer Question').click();
            cy.get('#answerTextInput').type('Answer Text 1 for Q1 newly added');
            cy.contains('Post Answer').click();

            cy.get('.questions-link').click();
            cy.contains('Active').click();
            cy.get('.postTitle').first().click();
            // cy.contains('Answer Question').click();
            cy.contains('Answer Text 1 for Q1 newly added')
        });

    });


    describe('CommentSection', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();
            cy.contains('Question Title 1').click();
        });

        it('Checks if a user can add a comment', () => {
            cy.get('.add-comment input[type="text"]').first().should('be.visible').type('This is a test comment.');

            cy.get('.add-comment button[type="submit"]').first().click();

            cy.get('.comment-text').should('contain', 'This is a test comment.');
        });

        it('Checks if a user can upvote a comment', () => {
            cy.get('.add-comment input[type="text"]').first().should('be.visible').type('This is a test comment.');

            cy.get('.add-comment button[type="submit"]').first().click();

            cy.get('.comment-text').should('contain', 'This is a test comment.');

            cy.get('.comment').first().find('button').click();
            cy.get('.comment').first().contains("Votes: 1");
        });

        it('Checks if a user can upvote a comment on an answer', () => {
            cy.get('.answer-container').first().find('.comment').first().find('button').click();
            cy.get('.answer-container').first().find('.comment').first().contains("Votes: 3");
        });

        it('Checks pagination for comments', () => {
            cy.get('.pagination button').contains('Next').click();
        });

        it('Rejects a comment over 140 characters', () => {
            const longComment = 'a'.repeat(141); // Generates a string with 141 characters
            cy.get('.add-comment input[type="text"]').first().should('be.visible').type(longComment);
            cy.get('.add-comment button[type="submit"]').first().click();

            // Assuming you show an error message when the comment is too long
            cy.get('.error-message').should('contain', 'Comment must be less than 140 characters.');

            // The comment should not be added to the list of comments
            cy.get('.comment-text').should('not.contain', longComment);
        });
    });

    describe('User Low Reputation', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUserLowRep(); // Ensure this command logs in a user with low reputation
        });

        it('Cannot Upvote a question', () => {
            cy.contains('Question Title').click();
            cy.get('.upvote-button-question').click();
            cy.get('.error-message').should('contain', 'You need a reputation of at least 50 to vote.');
        });

        it('Cannot Downvote a question', () => {
            cy.contains('Question Title').click();
            cy.get('.downvote-button-question').click();
            cy.get('.error-message').should('contain', 'You need a reputation of at least 50 to vote.');
        });

        it('Cannot Upvote an Answer', () => {
            cy.contains('Question Title').click();
            cy.get('.upvote-button-answer').first().click();
            cy.get('.error-message').should('contain', 'You need a reputation of at least 50 to vote.');
        });

        it('Cannot Downvote an Answer', () => {
            cy.contains('Question Title').click();
            cy.get('.downvote-button-answer').first().click();
            cy.get('.error-message').should('contain', 'You need a reputation of at least 50 to vote.');
        });


        it('Cannot Upvote a Comment', () => {
            cy.contains('Question Title').click();
            cy.get('.upvote-comment-button').first().click();
            cy.get('.error-message').should('contain', 'You need a reputation of at least 50 to vote on comments.');
        });

        it('Cannot add comment', () => {
            cy.contains('Question Title').click();
            cy.get('.add-comment input[type="text"]').first().should('be.visible').type('This is a test comment.');

            cy.get('.add-comment button[type="submit"]').first().click();

            cy.get('.error-message').contains('You need at least 50 reputation points to add a comment.');

        });

    });


    //---------------------------------------
    describe('Guest User Tests', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            // cy.loginGuest();
        });

        it('Checks if "Ask a Question" button is disabled for a guest user', () => {
            cy.get('.action-button-guest').click();
            cy.get('#askQuestionBtn').should('be.disabled');
        });

        it('Checks if "Answer Question" button is disabled for a guest user', () => {

            cy.get('.action-button-guest').click();
            cy.contains('Question Title 1').click();
            cy.get('#answerQuestionBtn').should('be.disabled');
        });

        it('Checks if search bar is available for a guest user', () => {
            cy.get('.action-button-guest').click();
            cy.get('#searchBar').should('exist');
            cy.get('#searchBar').type('test query{enter}');
        });

        it('Displays guest username and login button in the header', () => {
            cy.get('.action-button-guest').click();
            cy.contains('Hi Guest');
        });

    });

    // ---------------------------------------------
    describe('Question Activity tests', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();
        });

        it('Answering a question makes it latest.', () => {
            cy.contains('Question Title 3').click();

            cy.contains('Answer Question').click();
            cy.get('#answerTextInput').type('Answer Text 3 for Q3 newly added');
            cy.contains('Post Answer').click();

            cy.get('.questions-link').click();
            cy.contains('Active').click();
            cy.get('.postTitle').first().contains("Question Title 3");
        });

        it('Upvoting a Question', () => {
            cy.contains('Question Title 3').click();
            cy.get('.upvote-button-question').click();
            cy.get('.votes-display').first().should('contain', '31');
        });


        it('Downvoting a Question', () => {
            cy.contains('Question Title 3').click();
            cy.get('.downvote-button-question').click();
            cy.get('.votes-display').first().should('contain', '29');

        });

        it('Upvoting a Question reflects question activity', () => {
            cy.contains('Question Title 3').click();
            cy.get('.upvote-button-question').click();
            cy.get('.questions-link').click();
            cy.contains('Active').click();
            cy.get('.postTitle').first().contains("Question Title 3");
        });


        it('Downvoting a Question reflects question activity', () => {
            cy.contains('Question Title 3').click();
            cy.get('.downvote-button-question').click();
            cy.get('.questions-link').click();
            cy.contains('Active').click();
            cy.get('.postTitle').first().contains("Question Title 3");

        });

        it('Upvoting an Answer reflects question activity', () => {
            cy.contains('Question Title 3').click();
            cy.get('.upvote-button-answer').first().click();
            cy.get('.questions-link').click();
            cy.contains('Active').click();
            cy.get('.postTitle').first().contains("Question Title 3");
        });

        it('Downvoting an Answer', () => {
            cy.contains('Question Title 3').click();
            cy.get('.downvote-button-answer').first().click();
            cy.get('.questions-link').click();
            cy.contains('Active').click();
            cy.get('.postTitle').first().contains("Question Title 3");
        });

        it('Adding a Comment to an Answer', () => {
            cy.contains('Question Title 3').click();
            cy.get('.answer-container').first().find('.add-comment').within(() => {
                cy.get('input[type="text"]').type('This is a test comment.');
                cy.get('button[type="submit"]').click();
            });
            cy.get('.answer-container').first().find('.comment').first().find('.comment-text').first().should('contain', 'This is a test comment.');
        });

        it('Adding a Comment to an Answer reflects question activity', () => {
            cy.contains('Question Title 3').click();
            cy.get('.answer-container').first().find('.add-comment').within(() => {
                cy.get('input[type="text"]').type('This is a test comment.');
                cy.get('button[type="submit"]').click();
            });
            cy.get('.questions-link').click();
            cy.contains('Active').click();
            cy.get('.postTitle').first().contains("Question Title 3");
        });

        it('Adding a Comment to Question reflects quesstion activity', () => {
            cy.contains('Question Title 3').click();
            cy.get('.add-comment input[type="text"]').first().should('be.visible').type('This is a test comment.');

            cy.get('.add-comment button[type="submit"]').first().click();
            cy.get('.questions-link').click();
            cy.contains('Active').click();
            cy.get('.postTitle').first().contains("Question Title 3");

        });

        it('Upvoting a Comment to Question', () => {
            cy.contains('Question Title 3').click();
            cy.get('.add-comment input[type="text"]').first().should('be.visible').type('This is a test comment.');

            cy.get('.add-comment button[type="submit"]').first().click();

            cy.get('.comment-text').should('contain', 'This is a test comment.');

            cy.get('.comment').first().find('button').click();
            cy.get('.comment').first().contains("Votes:");
            cy.get('.questions-link').click();
            cy.contains('Active').click();
            cy.get('.postTitle').first().contains("Question Title 3");
        });


        it('Upvoting a Comment to Answer', () => {
            cy.contains('Question Title 3').click();
            cy.get('.answer-container').find('.comment').first().find('button').click();

            cy.get('.questions-link').click();
            cy.contains('Active').click();
            cy.get('.postTitle').first().contains("Question Title 3");
        });

        it('Reposting a Question in User Profile updates question activity', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-questions-button').click();
            cy.contains('Question Title 3').click();

            cy.get('#formTitleInput').should('have.value', 'Question Title 3');
            cy.get('#formTextInput').should('have.value', 'Question Text 3');

            cy.get('#formTitleInput').type('Question Title 3 Edited');
            cy.get('.blue-button').click();
            cy.contains('Active').click();
            cy.get('.postTitle').first().contains("Question Title 3");
        });

        it('Reposting an Answer in User Profile updates question activity', () => {
            cy.get('#userDisplay').click();
            cy.get('#user-answers-button').click();
            cy.contains('Answer Text 1 for Q3').click();

            cy.get('#answerTextInput').should('have.value', 'Answer Text 1 for Q3');

            cy.get('#answerTextInput').clear().type('Answer Text 1 for Q3 Edited');
            cy.get('.blue-button').click();

            cy.contains('Answer Text 1 for Q3 Edited');
            cy.get('.questions-link').click();
            cy.contains('Active').click();
            cy.get('.postTitle').first().contains("Question Title 3");
        });


    });


    describe('Homepage Votes User', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser()

        });

        it('Displays votes for user', () => {
            cy.contains('.postTitle', 'Question Title 1').parents('.question').within(() => {
                cy.get('.postStats').should('contain', '10 votes');
            });

        });
    });


    describe('Homepage Votes Guest', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            // cy.loginGuest();
        });

        it('Displays votes for Guest', () => {
            cy.get('.action-button-guest').click();
            cy.contains('.postTitle', 'Question Title 1').parents('.question').within(() => {
                cy.get('.postStats').should('contain', '10 votes');
            });
        });
    });

    describe('Question Details Tags Test', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser()

        });
        it('Checks if "Question Title 1" contains specific tags', () => {
            cy.contains('.postTitle', 'Question Title 1').click();
            cy.get('#tagsContainer').within(() => {
                cy.contains('tag1user2').should('exist');
                cy.contains('tag2user2').should('exist');
                cy.contains('tag3user2').should('exist');
                cy.contains('tag4user2').should('exist');
                cy.contains('tag5user2').should('exist');
            });
        });
    });

    describe('Accept Answer Test', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();
        });

        it('Checks if an answer can be accepted', () => {
            cy.contains('.postTitle', 'Question Title 1').click();
            cy.get('.answer').first().find('.accept-answer-button').click();
        });
    });

    describe('Accept Answer Pins the answer', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();
        });

        it('Checks if an answer can be accepted', () => {
            cy.contains('.postTitle', 'Question Title 1').click();
            cy.get('.answer').eq(1).find('.accept-answer-button').click();
            cy.get('.answer').first().should('contain', 'Answer Text 1 for Q1');
        });
    });


    describe('Answer Upvoting Test', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();
        });

        it('Checks if upvoting an answer increments the vote count', () => {
            cy.contains('.postTitle', 'Question Title 1').click();
            cy.get('.answer').find('.upvote-button-answer').first().click();;
            cy.get('.answerVotes').first().should('contain', '3 votes');
        });
    });

    describe('Answer Downvoting Test', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();
        });

        it('Checks if downvoting an answer increments the vote count', () => {
            cy.contains('.postTitle', 'Question Title 1').click();
            cy.get('.answer').find('.downvote-button-answer').first().click();;
            cy.get('.answerVotes').first().should('contain', '1 votes');
        });

    });

    describe('Question Upvoting Test', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();
        });

        it('Checks if upvoting a question increments the vote count', () => {
            cy.contains('.postTitle', 'Question Title 1').click();
            cy.get('.upvote-button-question').click();
            cy.get('#questionVotings .votes-display').should('contain', '11 votes');
        });
    });

    describe('Question Downvoting Test', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();
        });

        it('Checks if downvoting a question decrements the vote count', () => {
            cy.contains('.postTitle', 'Question Title 1').click();
            cy.get('.downvote-button-question').click();
            cy.get('#questionVotings .votes-display').should('contain', '9 votes');
        });
    });

    describe('Add Comment to Answer Test', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();

        });

        it('Checks if a new comment can be added to an answer', () => {
            cy.contains('.postTitle', 'Question Title 1').click();
            cy.get('.answer').first();
            cy.get('.add-comment input[type="text"]').first().should('be.visible').type('This is a test comment.');

            cy.get('.add-comment button[type="submit"]').first().click();

            cy.get('.comment-text').should('contain', 'This is a test comment.');
        });
    });

    describe('Home Page Questions User', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();

        });
        it('successfully shows All Questions string', () => {
            cy.contains('All Questions');
        })
    })

    describe('Home Page AskQuestion Button User', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();

        });
        it('successfully shows Ask a Question button', () => {
            cy.contains('Ask a Question');
        })
    })

    describe('Home Page Total questions User', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();

        });
        it('successfully shows total questions number', () => {
            cy.contains('11 questions');
        })
    })

    describe('Home Page Sorting Buttons User', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();

        });
        it('successfully shows filter buttons', () => {
            cy.contains('Newest');
            cy.contains('Active');
            cy.contains('Unanswered');
        })

    })

    describe ('Home Page Questions and Tags User', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();

        });
        it('successfully shows menu items', () => {
            cy.contains('Questions');
            cy.contains('Tags');
        })
    })

    describe ('Home Page Search bar Guest', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.get('.action-button-guest').click();

        });
        it('successfully shows search bar', () => {
            cy.get('#searchBar');
        })
    })

    describe('Home Page Title Guest', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.get('.action-button-guest').click();

        });
        it('successfully shows page title', () => {
            cy.contains('Fake Stack Overflow');
        })

    })

    describe('Home Page Questions Guest', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.get('.action-button-guest').click();

        });
        it('successfully shows All Questions string', () => {
            cy.contains('All Questions');
        })
    })

    describe('Home Page AskQuestion Button Guest', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.get('.action-button-guest').click();

        });
        it('successfully shows Ask a Question button', () => {
            cy.contains('Ask a Question');
        })
    })

    describe('Home Page Total questions Guest', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.get('.action-button-guest').click();

        });
        it('successfully shows total questions number', () => {
            cy.contains('11 questions');
        })
    })

    describe('Home Page Sorting Buttons Guest', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.get('.action-button-guest').click();

        });
        it('successfully shows filter buttons', () => {
            cy.contains('Newest');
            cy.contains('Active');
            cy.contains('Unanswered');
        })

    })

    describe ('Home Page Questions and Tags Guest', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.get('.action-button-guest').click();

        });
        it('successfully shows menu items', () => {
            cy.contains('Questions');
            cy.contains('Tags');
        })
    })

    describe ('Home Page Search bar Guest', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.get('.action-button-guest').click();

        });
        it('successfully shows search bar', () => {
            cy.get('#searchBar');
        })
    })

    describe('Home Page Title Guest', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.get('.action-button-guest').click();

        });
        it('successfully shows page title', () => {
            cy.contains('Fake Stack Overflow');
        })

    })


    describe('Question List Pagination Test - Next and Prev Buttons', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();
        });

        it('Checks if clicking the Next and then Prev buttons navigates correctly', () => {
            cy.get('.pagination button').contains('Next').click();
            cy.get('.pagination button').contains('Prev').click();
        });
    });

    describe('Question List Pagination Test - Next and Prev Buttons', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.get('.action-button-guest').click();

        });

        it('Checks if clicking the Next and then Prev buttons navigates correctly', () => {
            cy.get('.pagination button').contains('Next').click();
            cy.get('.pagination button').contains('Prev').click();
        });
    });

    describe('Question List Pagination Test - Prev Button Disabled on First Page User', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.loginUser();
        });

        it('Checks if the Prev button is disabled on the first page', () => {
            cy.get('.pagination button').contains('Prev').should('be.disabled');
        });
    });

    describe('Question List Pagination Test - Prev Button Disabled on First Page Guest', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/');
            cy.get('.action-button-guest').click();
        });

        it('Checks if the Prev button is disabled on the first page', () => {
            cy.get('.pagination button').contains('Prev').should('be.disabled');
        });
    });


    describe('Search Functionality', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000');
            cy.loginUser();
        });

        it('Displays search results and allows sorting', () => {
            const searchText = 'Question Title 1';
            cy.get('#searchBar').type(`${searchText}{enter}`);
            cy.get('.postTitle').should('have.length.at.least', 1);
            cy.contains('Newest').click();
            cy.contains('Active').click();
            cy.contains('Unanswered').click();

        });

        it('Shows "No Questions Found" for unsuccessful search', () => {
            const searchText = 'unfindableQuery123';
            cy.get('#searchBar').type(`${searchText}{enter}`);
            cy.contains('No Questions Found').should('exist');
        });

        it('Paginates search results correctly', () => {
            const searchText = 'Question';
            cy.get('#searchBar').type(`${searchText}{enter}`);
            cy.get('.postTitle').should('have.length', 5);
            cy.get('.pagination').contains('Next').click();
            cy.get('.postTitle').should('have.length', 5);
            cy.get('.pagination').contains('Prev').click();
            cy.get('.postTitle').should('have.length', 5);
        });

    });

    describe('All Tags', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000');
            cy.loginUser();
        });

        it('Total Tag Count', () => {
            cy.get('.tags-link').click();
            cy.contains('All Tags');
            cy.contains('1 Tags');
            cy.contains('Ask a Question');
        })
        it('Tag names and count', () => {
            const tagNames = ['tag1user1', 'tag1user2', 'tag2user1', 'tag2user2'];
            const tagCounts = ['5 questions', '5 questions', '5 questions', '5 questions'];
            cy.get('.tags-link').click();
            cy.get('.tagNode').each(($el, index, $list) => {
                if (index < 4) {
                    cy.wrap($el).should('contain', tagNames[index]);
                    cy.wrap($el).find('.tag-question-count').should('contain', tagCounts[index]);
                }

            })

        })
        it('Filters questions by clicking on tag', () => {
            cy.contains('Tags').click();
            cy.contains('tag11').click();
            cy.contains('Question Title 11');
        });

    })



})