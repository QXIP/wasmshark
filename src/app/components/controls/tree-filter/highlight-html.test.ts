import assert from 'node:assert/strict';
import test from 'node:test';
import { highlightHtml } from './highlight-html.ts';

test('returns the original text when there is no filter', () => {
  assert.deepEqual(highlightHtml('<script>alert(1)</script>', ''), [
    { text: '<script>alert(1)</script>', match: false },
  ]);
});

test('marks a markup-like filter as text, not as an element', () => {
  const payload = '<img src=x onerror=alert(1)>';
  assert.deepEqual(highlightHtml(payload, payload, true), [
    {
      text: payload,
      match: true,
      color: 'yellow',
      radius: '4px',
      textColor: undefined,
    },
  ]);
});

test('treats filter metacharacters as literals', () => {
  assert.deepEqual(highlightHtml('a.b+c', '.b+', false), [
    { text: 'a', match: false },
    {
      text: '.b+',
      match: true,
      color: 'yellow',
      radius: '2px',
      textColor: 'black',
    },
    { text: 'c', match: false },
  ]);
});

test('keeps color positions when an earlier OR term is empty', () => {
  assert.deepEqual(highlightHtml('point2', '||point2', false), [
    {
      text: 'point2',
      match: true,
      color: '#ffcaca',
      radius: '2px',
      textColor: 'black',
    },
  ]);
});

test('prefers the earlier filter when terms overlap', () => {
  assert.deepEqual(highlightHtml('hello', 'hell||ell', false).map((part) => part.text), ['hell', 'o']);
});
