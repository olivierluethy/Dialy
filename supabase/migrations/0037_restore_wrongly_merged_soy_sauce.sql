-- Dialy: undo one wrong merge in 0036. Names without Latin letters reduce to
-- an empty comparison key there, so the Japanese soy sauce
-- "小麦を使わない丸大豆しょうゆ" (10 g KH) was hidden as a duplicate of
-- "Капучччино" (8.4 g KH) - two different foods. It gets active = true again.
-- No other row of 0036 was affected: this was the only pair of such names
-- with close carbs.

update public.foods
set active = true
where id = 'off-4901011108975'
  and user_id is null
  and not active;
