# MVP WebApp Baseline

## Purpose

Tài liệu này khóa baseline kỹ thuật cho MVP WebApp trước khi thay đổi runtime hoặc dependency. Không tự động đồng bộ/rebase upstream trong quá trình thực hiện các task MVP nếu chưa review lại thay đổi.

## Source baseline

- Upstream repository: `https://github.com/anywhere-labs/dsh-desktop`
- Upstream owner/repository: `anywhere-labs/dsh-desktop`
- Upstream default branch tại thời điểm lập kế hoạch: `master`
- Audited source commit: `423406fe225442995902015cb6f10eed670ff115`
- Audited release: `v2.0.5`
- Audited upstream DeepSeek Harness commit: `a66e4702047846cdaa10c66c9d3df3951f5ea70d`
- Audited DSH runtime line: `0.1.2-rc.1`

Branch `implementation/mvp-edgeone-exact-baseline` được tạo trực tiếp từ exact audited source commit trên để staging implementation không trôi khỏi baseline.

## Planning artifact integrity

- `WEBAPP_EDGEONE_MIGRATION_MASTER_PLAN.md` SHA-256: `e665770e42c41cb86628daf7e69d784a0b675f8c1bb32d7035204d9313a14171`
- `PROJECT_TECHNICAL_AUDIT.md` SHA-256: `121cc446273e3defbf3f67cbfa3333b389deb3e51f720d9892a5e686bb266074`
- `MVP_WEBAPP_EXECUTION_PLAN.md` SHA-256: `8e89587e9633321d5e1978bd55ac2f9dac747278bbba957b68f1b4114bfd3d98`

## Locked MVP scope

MVP là một **single-user DSH Web cloud instance**. Golden Path cần đạt được:

`Owner -> HTTPS/EdgeOne -> outer auth -> reverse proxy -> DSH Web -> session -> model/agent -> result -> persisted session`.

MVP giữ nguyên và tái sử dụng DSH Web UI, agent core, API/RPC/WebSocket, session/settings/workspace và file-based persistence. MVP không port hoặc triển khai:

- Electron shell;
- desktop updater;
- stable/Beta coexistence behavior;
- native Desktop APIs;
- Community Marketplace/dynamic plugin install;
- multi-user shared-instance SaaS;
- database mới chỉ để phục vụ migration.

## Security hardening evidence

### Profile pnpm environment

- RED run `33831405621`: `yarn install --immutable` thành công; 5/6 materializer tests pass; sentinel test fail vì `DSH_MVP_SENTINEL_SECRET` bị forward vào child pnpm environment.
- Production patch `f40b1fe853331aeb3bc5089c211e36712e0167d7` bỏ inherited `...process.env` khỏi Profile pnpm materialization và giữ explicit runtime allowlist.

### Packaged pnpm

- RED PR run `33831612299`: invariant fail đúng tại pnpm `11.8.0`, yêu cầu `>=11.11.0` và `<12`.
- GREEN one-shot run `33831713858`: Yarn tự regenerate lockfile; version invariant pass; Profile secret-isolation test pass; generated diff được giới hạn đúng hai manifest và `yarn.lock`.
- Dependency commit `ebddf31532ddc44d016ee72898abe3f5844f30f3`: stable + beta pin pnpm `11.25.0`, lockfile checksum/resolution được Yarn tạo lại.
- Workflow one-shot có `contents: write` đã bị xóa ngay sau khi hoàn thành; workflow verification thường trực chỉ dùng `contents: read`.

## Target repository contract

Target cuối theo Master Plan là `thanhhaixn92/dsh-webapp-edgeone`, giữ full Git history và attribution, với mô hình remote mong muốn:

- `origin` = `thanhhaixn92/dsh-webapp-edgeone`
- `upstream` = `https://github.com/anywhere-labs/dsh-desktop.git`
- implementation branch = `migration/edgeone-webapp`
- production branch = `main`

## Exact-baseline staging status

Tại thời điểm triển khai task này, target repository chưa tồn tại và GitHub connector không có thao tác tạo repository. `thanhhaixn92/Pqg-desktop` chỉ được dùng làm **exact-baseline staging repository** vì repository này đã chứa audited source commit và tài khoản có quyền ghi.

Không merge implementation branch này vào `master` của `Pqg-desktop`. Khi target repo được tạo, chuyển các commit MVP đã review sang target branch bắt đầu từ cùng baseline SHA.

## Verification rule

Trước production phải xác minh đồng thời:

1. target repository tồn tại;
2. target implementation branch có ancestry từ exact audited source commit `423406fe225442995902015cb6f10eed670ff115`;
3. license/third-party notices được bảo toàn;
4. secret hygiene patch đã được áp dụng;
5. không có upstream update ngoài baseline chưa được review.
