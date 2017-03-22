import { expect } from 'chai';
import { horizontalLayout, circosLayout } from '../src/layouts.js';

describe('layout test', () => {
    it('horizontal layout', () => {
        expect( horizontalLayout ).to.equal('h');
    });

    it('circos layout', () => {
        expect( circosLayout ).to.equal('c');
    });
});

