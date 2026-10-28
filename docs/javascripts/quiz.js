(function () {
  function init() {
    var quizzes = Array.prototype.slice.call(document.querySelectorAll(".quiz"));
    if (!quizzes.length) return;

    var scoreEl = document.getElementById("quiz-score");
    var answered = 0;
    var correct = 0;

    function updateScore() {
      if (scoreEl) {
        scoreEl.textContent = correct + " correct · " + answered + " answered";
      }
    }

    quizzes.forEach(function (quiz) {
      var correctIndex = parseInt(quiz.getAttribute("data-correct"), 10);
      var options = Array.prototype.slice.call(quiz.querySelectorAll(".quiz-opt"));
      var explanation = quiz.querySelector(".quiz-exp");

      options.forEach(function (button, index) {
        button.addEventListener("click", function () {
          if (quiz.getAttribute("data-done") === "1") return;
          quiz.setAttribute("data-done", "1");

          options.forEach(function (option, optionIndex) {
            option.disabled = true;
            if (optionIndex === correctIndex) option.classList.add("is-correct");
            else if (optionIndex === index) option.classList.add("is-wrong");
          });

          if (explanation) explanation.hidden = false;
          answered += 1;
          if (index === correctIndex) correct += 1;
          updateScore();
        });
      });
    });

    var reset = document.getElementById("quiz-reset");
    if (reset) {
      reset.addEventListener("click", function () {
        quizzes.forEach(function (quiz) {
          quiz.removeAttribute("data-done");
          Array.prototype.forEach.call(quiz.querySelectorAll(".quiz-opt"), function (option) {
            option.disabled = false;
            option.classList.remove("is-correct", "is-wrong");
          });
          var explanation = quiz.querySelector(".quiz-exp");
          if (explanation) explanation.hidden = true;
        });
        answered = 0;
        correct = 0;
        updateScore();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    updateScore();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
