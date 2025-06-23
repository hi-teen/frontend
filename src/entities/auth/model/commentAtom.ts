import { atom } from 'jotai';

export interface ReplyItemType {
  replyId: number;
  content: string;
  anonymousNumber: number;
  createdDate: string;
}

export interface CommentItemType {
  commentId: number;
  content: string;
  anonymousNumber: number;
  createdDate: string;
  replies: ReplyItemType[];
}

export const commentListAtom = atom<CommentItemType[]>([]);

export const newCommentAtom = atom('');

export const replyTargetAtom = atom<number | null>(null);

export const replyCommentAtom = atom('');
