import { filterQuickLinksByRole } from '../utils';

describe('filterQuickLinksByRole', () => {
  it('filters by admin role', () => {
    const quickLinks = [
      {
        menu_link: 'https://example.com',
        menu_name: 'Quick Link 1',
        display_on: ['Dashboard', 'Menu'],
        roles: ['admin']
      },
      {
        menu_link: 'https://example.com',
        menu_name: 'Quick Link 2',
        display_on: ['Dashboard', 'Menu'],
        roles: ['admin', 'client']
      },
    ]
    const filteredQuickLinks = filterQuickLinksByRole(quickLinks, 'admin');
    expect(filteredQuickLinks).toEqual(expect.arrayContaining(quickLinks));
  });

  it('filters by client role', () => {
    const quickLinks = [
      {
        menu_link: 'https://example.com',
        menu_name: 'Admin quick link',
        display_on: ['Dashboard', 'Menu'],
        roles: ['admin']
      },
      {
        menu_link: 'https://example.com',
        menu_name: 'Client quick link',
        display_on: ['Dashboard', 'Menu'],
        roles: ['client']
      },
    ]
    const filteredQuickLinks = filterQuickLinksByRole(quickLinks, 'client');

    expect(filteredQuickLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ menu_name: 'Client quick link' })
        ])
      );
    expect(filteredQuickLinks).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({ menu_name: 'Admin quick link' })
        ])
      );
  });

  it('filters by resident role', () => {
    const quickLinks = [
      {
        menu_link: 'https://example.com',
        menu_name: 'Client quick link',
        display_on: ['Dashboard', 'Menu'],
        roles: ['client']
      },
      {
        menu_link: 'https://example.com',
        menu_name: 'Resident quick link',
        display_on: ['Dashboard', 'Menu'],
        roles: ['resident']
      },
    ]
    const filteredQuickLinks = filterQuickLinksByRole(quickLinks, 'resident');

    expect(filteredQuickLinks).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({ menu_name: 'Client quick link' })
      ])
    );
    expect(filteredQuickLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ menu_name: 'Resident quick link' })
      ])
    );
  });
});