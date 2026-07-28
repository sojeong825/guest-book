"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { addEntry, type FormState } from "./actions";
import styles from "./page.module.css";

const initialState: FormState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submit} disabled={pending}>
      {pending ? "축하 중…" : "축하하기"}
    </button>
  );
}

export default function GuestbookForm() {
  const [state, formAction] = useFormState(addEntry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className={styles.form} noValidate>
      {/* Input / Name, Input / Message, SubmitButton (Figma 1368:23446) */}
      <div className={styles.fields}>
        <input
          name="name"
          className={styles.input}
          placeholder="이름"
          maxLength={20}
          autoComplete="off"
          aria-label="이름"
        />
        <textarea
          name="message"
          className={styles.textarea}
          placeholder="메시지를 남겨주세요"
          maxLength={200}
          aria-label="메시지"
        />
        <SubmitButton />
      </div>

      {/* 비밀글 체크박스 (Figma 1368:23439) */}
      <label className={styles.secretRow}>
        <input type="checkbox" name="is_secret" className={styles.checkInput} />
        <span className={styles.checkVisual} aria-hidden="true">
          <span className={styles.checkBoxInner}>
            {/* Figma 에서 내보낸 체크 글리프 (Union) */}
            <img src="/check.svg" alt="" className={styles.checkGlyph} />
          </span>
        </span>
        <span className={styles.secretLabel}>비밀글</span>
      </label>

      {state?.error && (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
