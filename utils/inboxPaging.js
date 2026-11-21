// Page sizes the inbox offers. Shared by the Inbox tab's menu and
// /api/manage/inbox, which only accepts one of these (the first is default).
export const INBOX_PAGE_SIZES = [10, 25, 50];

export const parseInboxPageSize = (value) => {
  const size = Number(value);
  return INBOX_PAGE_SIZES.includes(size) ? size : INBOX_PAGE_SIZES[0];
};
