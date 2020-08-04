const assert = require('assert')
const { evalResults, evaluate } = require("../combo_evaluator")

describe('test_tie', () => {
    it('should return tie', () => {
        p1_cards = ['B1', 'B2', 'B3']
        p2_cards = ['R1', 'R2', 'R3']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.TIE)
    });
});

describe('test_colorrun_comparisons', () => {
    it('higher color run', () => {
        p1_cards = ['B1', 'B2', 'B3']
        p2_cards = ['R2', 'R3', 'R4']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.OPPONENTWINNER)
    });

    it('color run vs. 3 of a kind', () => {
        p1_cards = ['B1', 'B2', 'B3']
        p2_cards = ['R6', 'Y6', 'B6']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.PLAYERWINNER)
    });

    it('color run vs. color', () => {
        p1_cards = ['B1', 'B2', 'B3']
        p2_cards = ['R6', 'R2', 'R3']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.PLAYERWINNER)
    });

    it('color run vs. run', () => {
        p1_cards = ['B1', 'B2', 'B3']
        p2_cards = ['R2', 'Y3', 'R4']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.PLAYERWINNER)
    });

    it('color run vs. sum', () => {
        p1_cards = ['B1', 'B2', 'B3']
        p2_cards = ['R5', 'Y6', 'B6']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.PLAYERWINNER)
    });
});

describe('test_threeofkind_comparisons', () => {
    it('tie', () => {
        p1_cards = ['B3', 'R3', 'Y3']
        p2_cards = ['P3', 'G3', 'O3']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.TIE)
    });

    it('higher 3 of a kind', () => {
        p1_cards = ['B3', 'R3', 'Y3']
        p2_cards = ['P4', 'G4', 'O4']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.OPPONENTWINNER)
    });

    it('3 of a kind vs. color', () => {
        p1_cards = ['B1', 'R1', 'G1']
        p2_cards = ['R6', 'R2', 'R3']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.PLAYERWINNER)
    });

    it('3 of a kind vs. run', () => {
        p1_cards = ['B1', 'R1', 'G1']
        p2_cards = ['R2', 'Y3', 'R4']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.PLAYERWINNER)
    });

    it('3 of a kind vs. sum', () => {
        p1_cards = ['B1', 'R1', 'G1']
        p2_cards = ['R5', 'Y6', 'B6']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.PLAYERWINNER)
    });
});

describe('test_color_comparisons', () => {
    it('tie', () => {
        p1_cards = ['R6', 'R2', 'R3']
        p2_cards = ['B6', 'B2', 'B3']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.TIE)
    });

    it('higher color', () => {
        p1_cards = ['R6', 'R2', 'R3']
        p2_cards = ['B6', 'B2', 'B4']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.OPPONENTWINNER)
    });

    it('color vs. run', () => {
        p1_cards = ['R6', 'R2', 'R3']
        p2_cards = ['R2', 'Y3', 'R4']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.PLAYERWINNER)
    });

    it('color vs. sum', () => {
        p1_cards = ['R6', 'R2', 'R3']
        p2_cards = ['R5', 'Y6', 'B6']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.PLAYERWINNER)
    });
});

describe('test_run_comparisons', () => {
    it('tie', () => {
        p1_cards = ['R2', 'Y3', 'R4']
        p2_cards = ['B2', 'R3', 'B4']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.TIE)
    });

    it('higher run', () => {
        p1_cards = ['R2', 'Y3', 'R4']
        p2_cards = ['B3', 'R4', 'B5']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.OPPONENTWINNER)
    });

    it('run vs. sum', () => {
        p1_cards = ['R2', 'Y3', 'R4']
        p2_cards = ['R5', 'Y6', 'B6']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.PLAYERWINNER)
    });
});

describe('test_sum_comparisons', () => {
    it('tie', () => {
        p1_cards = ['R1', 'Y3', 'B5']
        p2_cards = ['R5', 'Y3', 'B1']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.TIE)
    });

    it('higher sum', () => {
        p1_cards = ['R2', 'Y3', 'R4']
        p2_cards = ['B3', 'R4', 'B5']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.OPPONENTWINNER)
    });
});

describe('test_incomplete_comparisons', () => {
    it('one side complete set, other incomplete', () => {
        p1_cards = ['R2', 'Y3', 'R4']
        p2_cards = ['B3', 'R4']
        assert.equal(evaluate(p1_cards, p2_cards), evalResults.PLAYERWINNER)
    });
});
