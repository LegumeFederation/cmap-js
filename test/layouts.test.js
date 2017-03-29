import { expect } from 'chai';
import { horizontalLayout, circosLayout } from '../src/layouts';

describe('Layout test', () => {
  it('horizontal constant is defined', () => {
      expect( horizontalLayout ).to.equal('h');
  });
  it('circos constant is defined', () => {
      expect( circosLayout ).to.equal('c');
  });
});
