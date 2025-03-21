document.addEventListener("DOMContentLoaded", () => {
    const quizForm = document.getElementById("quiz-form");
    const addQuestionBtn = document.getElementById("add-question");
    const questionsContainer = document.getElementById("questions-container");
    const quizzesList = document.getElementById("quizzes");
    const leaderboardTable = document.getElementById("leaderboard-table");
    let quizzes = [];

    addQuestionBtn.addEventListener("click", () => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.innerHTML = `
            <input type="text" placeholder="Question" required>
            <input type="text" placeholder="Option 1" required>
            <input type="text" placeholder="Option 2" required>
            <input type="text" placeholder="Option 3" required>
            <input type="text" placeholder="Option 4" required>
            <input type="number" placeholder="Correct Option (1-4)" required>
            <button type="button" class="remove-question">Remove</button>
        `;
        questionsContainer.appendChild(questionDiv);
        
        questionDiv.querySelector(".remove-question").addEventListener("click", () => {
            questionDiv.remove();
        });
    });

    quizForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const quizTitle = document.getElementById("quiz-title").value;
        const questions = [];
        
        document.querySelectorAll(".question").forEach(q => {
            const inputs = q.querySelectorAll("input");
            questions.push({
                question: inputs[0].value,
                options: [inputs[1].value, inputs[2].value, inputs[3].value, inputs[4].value],
                answer: Number(inputs[5].value)
            });
        });
        
        quizzes.push({ title: quizTitle, questions });
        updateQuizList();
        quizForm.reset();
        questionsContainer.innerHTML = "";
    });

    function updateQuizList() {
        quizzesList.innerHTML = "";
        quizzes.forEach((quiz, index) => {
            const quizItem = document.createElement("li");
            quizItem.textContent = quiz.title;
            quizItem.addEventListener("click", () => startQuiz(index));
            quizzesList.appendChild(quizItem);
        });
    }

    function startQuiz(index) {
        const quiz = quizzes[index];
        const quizTitleDisplay = document.getElementById("quiz-title-display");
        const quizQuestionsContainer = document.getElementById("quiz-questions");
        document.getElementById("quiz-taking").style.display = "block";
        quizTitleDisplay.textContent = quiz.title;
        quizQuestionsContainer.innerHTML = "";

        quiz.questions.forEach((q, i) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${q.question}</p>
                ${q.options.map((opt, idx) => `
                    <label>
                        <input type="radio" name="q${i}" value="${idx + 1}"> ${opt}
                    </label>
                `).join("")}
            `;
            quizQuestionsContainer.appendChild(questionDiv);
        });

        document.getElementById("submit-quiz").onclick = () => {
            let score = 0;
            quiz.questions.forEach((q, i) => {
                const selectedOption = document.querySelector(`input[name='q${i}']:checked`);
                if (selectedOption && Number(selectedOption.value) === q.answer) {
                    score++;
                }
            });
            document.getElementById("quiz-result").textContent = `Your Score: ${score} / ${quiz.questions.length}`;
            updateLeaderboard("User", score);
        };
    }

    function updateLeaderboard(user, score) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${leaderboardTable.children.length + 1}</td><td>${user}</td><td>${score}</td>`;
        leaderboardTable.appendChild(row);
    }
});
