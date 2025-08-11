import { i18n } from '@lingui/core';

describe('i18n.activate function', () => {
  const mockActivate = jest.mocked(i18n.activate);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be called with English locale', () => {
    i18n.activate('en');
    expect(mockActivate).toHaveBeenCalledWith('en');
  });

  it('should be called with Chinese locale', () => {
    i18n.activate('zh');
    expect(mockActivate).toHaveBeenCalledWith('zh');
  });

  it('should track multiple calls', () => {
    i18n.activate('en');
    i18n.activate('zh');
    i18n.activate('en');

    expect(mockActivate).toHaveBeenCalledTimes(3);
    expect(mockActivate).toHaveBeenNthCalledWith(1, 'en');
    expect(mockActivate).toHaveBeenNthCalledWith(2, 'zh');
    expect(mockActivate).toHaveBeenNthCalledWith(3, 'en');
  });
});