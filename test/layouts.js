import { expect } from 'chai';
import { horizontalLayout as hLay, circosLayout as cLay } from '../src/layouts.js';

describe('layout test', () => {
    it('horizontal layout', () => {
        expect( hLay ).to.equal('h');
    });

    it('returns self', () => {
        expect( cLay ).to.equal('c');
    });
});

