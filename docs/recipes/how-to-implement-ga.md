## How to Implement GA

1. Add line in the file import { bindGa } from 'helpers/analytics';
2. Add data-ga to the element omn which GA has to be implemented
3. data-ga should be in format if you need all three parameters 'category|action|label' else use 'action|label' format
4. Add @bindGa({}) line on top of onClick function of the element on which GA has to be triggered

#### Note:

If you don't pass category, page name will be used. If no page name is available then page URL will be passed.
